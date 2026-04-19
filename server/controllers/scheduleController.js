const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');
const { exchanges, profiles, sessions, users } = require('../db/schema/index');
const { eq, desc } = require('drizzle-orm');
const { findOverlapSlots } = require('../utils/scheduleUtils');

const getOverlapSlots = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.exchangeId));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const [profileA] = await db.select({ availability: profiles.availability }).from(profiles).where(eq(profiles.userId, exchange.userAId));
    const [profileB] = await db.select({ availability: profiles.availability }).from(profiles).where(eq(profiles.userId, exchange.userBId));

    if (!profileA || !profileB) return res.status(400).json({ message: 'Both users must set their availability' });

    const slots = findOverlapSlots(profileA.availability || [], profileB.availability || []);
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scheduleSession = async (req, res) => {
  try {
    const { exchangeId, scheduledAt } = req.body;

    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, exchangeId));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const [session] = await db.insert(sessions)
      .values({
        exchangeId,
        scheduledAt: new Date(scheduledAt),
        teacherId: exchange.userAId,
        studentId: exchange.userBId,
        roomId: uuidv4(),
      })
      .returning();

    // Activate exchange if pending
    if (exchange.status === 'pending') {
      await db.update(exchanges).set({ status: 'active', updatedAt: new Date() }).where(eq(exchanges.id, exchangeId));
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExchangeSessions = async (req, res) => {
  try {
    const exchangeSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.exchangeId, req.params.exchangeId))
      .orderBy(sessions.scheduledAt);

    const enriched = await Promise.all(
      exchangeSessions.map(async (s) => {
        const [teacher] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, s.teacherId));
        const [student] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, s.studentId));
        return { ...s, teacher, student };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverlapSlots, scheduleSession, getExchangeSessions };