const { db } = require('../config/db');
const { reviews, users, profiles, exchanges } = require('../db/schema/index');
const { eq, and, desc } = require('drizzle-orm');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { revieweeId, exchangeId, sessionId, rating, comment, type } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    if (revieweeId === req.user.id)
      return res.status(400).json({ message: 'You cannot review yourself' });

    // Exchange participant check
    if (exchangeId) {
      const [exchange] = await db
        .select()
        .from(exchanges)
        .where(eq(exchanges.id, exchangeId));

      if (!exchange)
        return res.status(404).json({ message: 'Exchange not found' });

      const isParticipant =
        exchange.userAId === req.user.id || exchange.userBId === req.user.id;

      if (!isParticipant)
        return res.status(403).json({ message: 'Only exchange participants can submit reviews' });
    }

    // Duplicate check
    const [existing] = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.reviewerId, req.user.id),
          eq(reviews.revieweeId, revieweeId),
          eq(reviews.exchangeId, exchangeId)
        )
      );

    if (existing)
      return res.status(400).json({ message: 'You have already submitted a review for this exchange' });

    // Save
    const [review] = await db
      .insert(reviews)
      .values({
        reviewerId: req.user.id,
        revieweeId,
        exchangeId: exchangeId || null,
        sessionId: sessionId || null,
        rating: parseInt(rating),
        comment: comment || null,
        type: type || 'exchange',
      })
      .returning();

    // Average rating update
    const allReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.revieweeId, revieweeId));

    const avg = Math.round(
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    );

    await db
      .update(profiles)
      .set({ rating: avg, updatedAt: new Date() })
      .where(eq(profiles.userId, revieweeId));

    res.status(201).json({ message: 'Review submitted successfully!', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/user/:userId
const getUserReviews = async (req, res) => {
  try {
    const userReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        type: reviews.type,
        createdAt: reviews.createdAt,
        exchangeId: reviews.exchangeId,
        reviewer: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, req.params.userId))
      .orderBy(desc(reviews.createdAt));

    const averageRating = userReviews.length
      ? parseFloat(
          (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1)
        )
      : 0;

    res.json({ reviews: userReviews, averageRating, total: userReviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/exchange/:exchangeId
const getExchangeReviews = async (req, res) => {
  try {
    const exchangeReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        revieweeId: reviews.revieweeId,
        reviewer: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.exchangeId, req.params.exchangeId))
      .orderBy(desc(reviews.createdAt));

    res.json(exchangeReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/my
const getMyReviews = async (req, res) => {
  try {
    const myReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewer: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, req.user.id))
      .orderBy(desc(reviews.createdAt));

    const avg = myReviews.length
      ? parseFloat(
          (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
        )
      : 0;

    res.json({ reviews: myReviews, averageRating: avg, total: myReviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, req.params.id));

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.reviewerId !== req.user.id)
      return res.status(403).json({ message: 'You can only delete your own review' });

    await db.delete(reviews).where(eq(reviews.id, req.params.id));
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews, getExchangeReviews, getMyReviews, deleteReview };