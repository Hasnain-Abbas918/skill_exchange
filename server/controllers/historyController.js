const { db } = require('../config/db');
const { requests, exchanges, sessions, users, bids, logs } = require('../db/schema/index');
const { eq, or, desc, and, sql } = require('drizzle-orm');

// @route GET /api/history/requests
const getRequestHistory = async (req, res) => {
  try {
    const sent = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        direction: sql`'sent'`,
        other: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.receiverId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.senderId, req.user.id))
      .orderBy(desc(requests.createdAt));

    const received = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        direction: sql`'received'`,
        other: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.senderId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.receiverId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/sessions
const getSessionHistory = async (req, res) => {
  try {
    const myExchanges = await db
      .select({ id: exchanges.id })
      .from(exchanges)
      .where(or(eq(exchanges.userAId, req.user.id), eq(exchanges.userBId, req.user.id)));

    const exchangeIds = myExchanges.map((e) => e.id);
    if (!exchangeIds.length) return res.json([]);

    const allSessions = [];
    for (const eid of exchangeIds) {
      const s = await db
        .select({
          id: sessions.id, scheduledAt: sessions.scheduledAt, status: sessions.status,
          startedAt: sessions.startedAt, endedAt: sessions.endedAt, duration: sessions.duration,
          roomId: sessions.roomId,
          teacher: { id: users.id, name: users.name, avatar: users.avatar },
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.teacherId, users.id))
        .where(eq(sessions.exchangeId, eid))
        .orderBy(desc(sessions.scheduledAt));
      allSessions.push(...s);
    }

    res.json(allSessions.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/activity
const getActivityTimeline = async (req, res) => {
  try {
    const activity = await db
      .select()
      .from(logs)
      .where(eq(logs.userId, req.user.id))
      .orderBy(desc(logs.createdAt))
      .limit(50);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/summary
const getHistorySummary = async (req, res) => {
  try {
    const uid = req.user.id;

    const [sentTotal] = await db
      .select({ count: sql`count(*)` })
      .from(requests)
      .where(eq(requests.senderId, uid));

    const [receivedTotal] = await db
      .select({ count: sql`count(*)` })
      .from(requests)
      .where(eq(requests.receiverId, uid));

    const [acceptedTotal] = await db
      .select({ count: sql`count(*)` })
      .from(requests)
      .where(and(eq(requests.receiverId, uid), eq(requests.status, 'accepted')));

    const myExchanges = await db
      .select({ id: exchanges.id })
      .from(exchanges)
      .where(or(eq(exchanges.userAId, uid), eq(exchanges.userBId, uid)));

    const exchangeIds = myExchanges.map((e) => e.id);
    let completedSessions = 0;
    let missedSessions = 0;

    for (const eid of exchangeIds) {
      const [comp] = await db
        .select({ count: sql`count(*)` })
        .from(sessions)
        .where(and(eq(sessions.exchangeId, eid), eq(sessions.status, 'completed')));
      const [miss] = await db
        .select({ count: sql`count(*)` })
        .from(sessions)
        .where(and(eq(sessions.exchangeId, eid), eq(sessions.status, 'missed')));
      completedSessions += Number(comp?.count || 0);
      missedSessions += Number(miss?.count || 0);
    }

    res.json({
      requestsSent: Number(sentTotal?.count || 0),
      requestsReceived: Number(receivedTotal?.count || 0),
      requestsAccepted: Number(acceptedTotal?.count || 0),
      activeExchanges: myExchanges.length,
      completedSessions,
      missedSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRequestHistory, getSessionHistory, getActivityTimeline, getHistorySummary };