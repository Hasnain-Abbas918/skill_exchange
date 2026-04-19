const { db } = require('../config/db');
const { requests, exchanges, conversations, conversationParticipants, notifications, users, bids, sessions } = require('../db/schema/index');
const { eq, and, desc } = require('drizzle-orm');
const { v4: uuidv4 } = require('uuid');

// ✅ Auto generate sessions
const generateSessions = async (exchangeId, userAId, userBId, estimatedDays) => {
  const days = estimatedDays || 7;
  const sessionsList = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const baseDate = new Date(now);
    baseDate.setDate(now.getDate() + i + 1);

    // 2 hour session — userA teaches userB
    const twoHrDate = new Date(baseDate);
    twoHrDate.setHours(10, 0, 0, 0);
    sessionsList.push({
      exchangeId,
      scheduledAt: twoHrDate,
      duration: 120,
      teacherId: userAId,
      studentId: userBId,
      roomId: uuidv4(),
      sessionNumber: i + 1,
      isExtra: 0,
    });

    // 1 hour session — userB teaches userA
    const oneHrDate = new Date(baseDate);
    oneHrDate.setHours(14, 0, 0, 0);
    sessionsList.push({
      exchangeId,
      scheduledAt: oneHrDate,
      duration: 60,
      teacherId: userBId,
      studentId: userAId,
      roomId: uuidv4(),
      sessionNumber: i + 1,
      isExtra: 0,
    });
  }

  await db.insert(sessions).values(sessionsList);
};

// @route POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { bidId, receiverId, message, estimatedDays } = req.body;

    const [existing] = await db.select().from(requests)
      .where(and(eq(requests.senderId, req.user.id), eq(requests.bidId, bidId), eq(requests.status, 'pending')));
    if (existing) return res.status(400).json({ message: 'You already sent a request for this bid' });

    const [request] = await db.insert(requests)
      .values({ senderId: req.user.id, receiverId, bidId, message, estimatedDays })
      .returning();

    await db.insert(notifications).values({
      userId: receiverId,
      type: 'request',
      message: `${req.user.name} sent you a skill exchange request`,
      link: `/requests/${request.id}`,
    });

    req.io.to(receiverId).emit('new_notification', {
      type: 'request',
      message: `${req.user.name} sent you a request!`,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests/received
const getReceivedRequests = async (req, res) => {
  try {
    const received = await db
      .select({
        id: requests.id,
        message: requests.message,
        status: requests.status,
        estimatedDays: requests.estimatedDays,
        createdAt: requests.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.senderId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.receiverId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json(received);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests/sent
const getSentRequests = async (req, res) => {
  try {
    const sent = await db
      .select({
        id: requests.id,
        message: requests.message,
        status: requests.status,
        estimatedDays: requests.estimatedDays,
        createdAt: requests.createdAt,
        receiver: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.receiverId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.senderId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json(sent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/requests/:id/accept
const acceptRequest = async (req, res) => {
  try {
    const [request] = await db.select().from(requests).where(eq(requests.id, req.params.id));
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

    await db.update(requests)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(requests.id, request.id));

    const [exchange] = await db.insert(exchanges)
      .values({
        userAId: request.senderId,
        userBId: request.receiverId,
        bidId: request.bidId,
        requestId: request.id,
        status: 'active',
      })
      .returning();

    // ✅ Auto generate sessions
    await generateSessions(
      exchange.id,
      request.senderId,
      request.receiverId,
      request.estimatedDays
    );

    const [conv] = await db.insert(conversations)
      .values({ exchangeId: exchange.id })
      .returning();

    await db.insert(conversationParticipants).values([
      { conversationId: conv.id, userId: request.senderId },
      { conversationId: conv.id, userId: request.receiverId },
    ]);

    await db.insert(notifications).values({
      userId: request.senderId,
      type: 'exchange',
      message: 'Your request was accepted! Sessions have been scheduled.',
      link: `/exchanges/${exchange.id}`,
    });

    req.io.to(request.senderId).emit('new_notification', {
      type: 'exchange_created',
      exchangeId: exchange.id,
    });

    res.json({ message: 'Request accepted', exchange });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/requests/:id/reject
const rejectRequest = async (req, res) => {
  try {
    const [request] = await db.select().from(requests).where(eq(requests.id, req.params.id));
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await db.update(requests)
      .set({ status: 'rejected', updatedAt: new Date() })
      .where(eq(requests.id, request.id));

    await db.insert(notifications).values({
      userId: request.senderId,
      type: 'request',
      message: 'Your exchange request was declined.',
    });

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getReceivedRequests, getSentRequests, acceptRequest, rejectRequest };