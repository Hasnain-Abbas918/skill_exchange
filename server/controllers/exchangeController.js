const { db } = require('../config/db');
const { exchanges, users, bids, streaks, notifications } = require('../db/schema/index');
const { eq, or, and } = require('drizzle-orm');

const getMyExchanges = async (req, res) => {
  try {
    const myExchanges = await db
      .select({
        id: exchanges.id, status: exchanges.status, createdAt: exchanges.createdAt,
        pauseReason: exchanges.pauseReason, cancelReason: exchanges.cancelReason,
        userAId: exchanges.userAId, userBId: exchanges.userBId,
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(exchanges)
      .innerJoin(bids, eq(exchanges.bidId, bids.id))
      .where(or(eq(exchanges.userAId, req.user.id), eq(exchanges.userBId, req.user.id)));

    // Fetch user details for each exchange separately
    const enriched = await Promise.all(
      myExchanges.map(async (ex) => {
        const partnerId = ex.userAId === req.user.id ? ex.userBId : ex.userAId;
        const [partner] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, partnerId));
        return { ...ex, partner };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExchangeById = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const [userA] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, exchange.userAId));
    const [userB] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, exchange.userBId));
    const [bid] = await db.select().from(bids).where(eq(bids.id, exchange.bidId));

    res.json({ ...exchange, userA, userB, bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestPause = async (req, res) => {
  try {
    const { reason } = req.body;
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    await db.update(exchanges)
      .set({ pauseRequestedById: req.user.id, pauseReason: reason, updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    const otherId = exchange.userAId === req.user.id ? exchange.userBId : exchange.userAId;
    await db.insert(notifications).values({
      userId: otherId, type: 'exchange',
      message: `${req.user.name} wants to pause the exchange: ${reason}`,
      link: `/exchanges/${exchange.id}`,
    });

    req.io.to(otherId).emit('new_notification', { type: 'pause_request' });
    res.json({ message: 'Pause request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPause = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange?.pauseRequestedById) return res.status(400).json({ message: 'No pause request found' });

    await db.update(exchanges)
      .set({ status: 'paused', pauseApprovedById: req.user.id, pausedAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    // Freeze both streaks
    await db.update(streaks).set({ isFrozen: true, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userAId));
    await db.update(streaks).set({ isFrozen: true, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userBId));

    res.json({ message: 'Exchange paused, streaks frozen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resumeExchange = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Not found' });

    await db.update(exchanges)
      .set({ status: 'active', pauseRequestedById: null, pauseApprovedById: null, pauseReason: null, resumedAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    await db.update(streaks).set({ isFrozen: false, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userAId));
    await db.update(streaks).set({ isFrozen: false, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userBId));

    res.json({ message: 'Exchange resumed, streaks unfrozen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 1 - Send cancel request (mutual agreement required)
const requestCancel = async (req, res) => {
  try {
    const { reason } = req.body;
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    await db.update(exchanges)
      .set({ cancelRequestedById: req.user.id, cancelReason: reason, updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    const otherId = exchange.userAId === req.user.id ? exchange.userBId : exchange.userAId;
    await db.insert(notifications).values({
      userId: otherId, type: 'exchange',
      message: `${req.user.name} wants to cancel the exchange: ${reason}`,
      link: `/exchanges/${exchange.id}`,
    });
    req.io.to(otherId).emit('new_notification', { type: 'cancel_request' });

    res.json({ message: 'Cancel request sent. Other user must approve.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 2 - Approve cancellation (requires agreement from both users)
const approveCancel = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange?.cancelRequestedById) return res.status(400).json({ message: 'No cancel request found' });

    const isOtherUser = exchange.cancelRequestedById !== req.user.id &&
      (exchange.userAId === req.user.id || exchange.userBId === req.user.id);
    if (!isOtherUser) return res.status(403).json({ message: 'You cannot approve your own cancel request' });

    await db.update(exchanges)
      .set({ status: 'cancelled', cancelApprovedById: req.user.id, cancelledAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    res.json({ message: 'Exchange cancelled by mutual agreement. No penalties applied.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyExchanges, getExchangeById, requestPause, confirmPause, resumeExchange, requestCancel, approveCancel };