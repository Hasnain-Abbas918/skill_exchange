const { db } = require('../config/db');
const { bids, users } = require('../db/schema/index');
const { eq, ne, and, desc, sql } = require('drizzle-orm'); // ne import

// @route POST /api/bids
const createBid = async (req, res) => {
  try {
    const { skillOffered, skillWanted, description, level, tags } = req.body;

    // Validation
    if (!skillOffered || !skillWanted || !description) {
      return res.status(400).json({ message: 'skillOffered, skillWanted, and description are required' });
    }

    // Normalize tags array
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const [bid] = await db
      .insert(bids)
      .values({
        creatorId: req.user.id,
        skillOffered: skillOffered.trim(),
        skillWanted: skillWanted.trim(),
        description: description.trim(),
        level: level || 'Beginner',
        tags: tagsArray,
      })
      .returning();

    // Fetch creator info
    const [creator] = await db
      .select({ id: users.id, name: users.name, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, req.user.id));

    res.status(201).json({ ...bid, creator });
  } catch (error) {
    console.error('createBid error:', error.message);
    res.status(500).json({ message: `Bid creation failed: ${error.message}` });
  }
};

// @route GET /api/bids
const getAllBids = async (req, res) => {
  try {
    const { search, level, page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Get all active bids except current user's bids
    let allBids = await db
      .select({
        id: bids.id,
        skillOffered: bids.skillOffered,
        skillWanted: bids.skillWanted,
        description: bids.description,
        level: bids.level,
        tags: bids.tags,
        isActive: bids.isActive,
        createdAt: bids.createdAt,
        creatorId: bids.creatorId,
      })
      .from(bids)
      .where(and(eq(bids.isActive, true), ne(bids.creatorId, req.user.id)))
      .orderBy(desc(bids.createdAt));

    // Filter in JS (simpler than complex SQL)
    if (search) {
      const s = search.toLowerCase();
      allBids = allBids.filter(
        (b) =>
          b.skillOffered.toLowerCase().includes(s) ||
          b.skillWanted.toLowerCase().includes(s) ||
          b.description.toLowerCase().includes(s) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(s))
      );
    }
    if (level) {
      allBids = allBids.filter((b) => b.level === level);
    }

    const total = allBids.length;
    const paginated = allBids.slice(offset, offset + Number(limit));

    // Fetch creator details for each bid
    const enriched = await Promise.all(
      paginated.map(async (bid) => {
        const [creator] = await db
          .select({ id: users.id, name: users.name, avatar: users.avatar })
          .from(users)
          .where(eq(users.id, bid.creatorId));
        return { ...bid, creator };
      })
    );

    res.json({ bids: enriched, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    console.error('getAllBids error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids/my
const getMyBids = async (req, res) => {
  try {
    const myBids = await db
      .select()
      .from(bids)
      .where(eq(bids.creatorId, req.user.id))
      .orderBy(desc(bids.createdAt));
    res.json(myBids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids/:id
const getBidById = async (req, res) => {
  try {
    const [bid] = await db.select().from(bids).where(eq(bids.id, req.params.id));
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    const [creator] = await db
      .select({ id: users.id, name: users.name, avatar: users.avatar, email: users.email })
      .from(users)
      .where(eq(users.id, bid.creatorId));

    res.json({ ...bid, creator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/bids/:id
const updateBid = async (req, res) => {
  try {
    const [bid] = await db.select().from(bids).where(eq(bids.id, req.params.id));
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.creatorId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { skillOffered, skillWanted, description, level, isActive } = req.body;
    const [updated] = await db
      .update(bids)
      .set({
        ...(skillOffered && { skillOffered }),
        ...(skillWanted && { skillWanted }),
        ...(description && { description }),
        ...(level && { level }),
        ...(typeof isActive === 'boolean' && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(bids.id, req.params.id))
      .returning();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/bids/:id
const deleteBid = async (req, res) => {
  try {
    const [bid] = await db.select().from(bids).where(eq(bids.id, req.params.id));
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.creatorId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await db.delete(bids).where(eq(bids.id, req.params.id));
    res.json({ message: 'Bid deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBid, getAllBids, getMyBids, getBidById, updateBid, deleteBid };