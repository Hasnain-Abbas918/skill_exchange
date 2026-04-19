# ⭐ Review System — Complete Implementation
# Frontend + Backend — Kahan Kya Likhna Hai

---

## 🔄 Flow Samjho Pehle

```
Exchange complete hoti hai
        ↓
ExchangesPage par "Review Likho" button aata hai
        ↓
ReviewModal open hota hai (Stars + Comment)
        ↓
POST /api/reviews → DB mein save
        ↓
Reviewee ki average rating update hoti hai
        ↓
ProfilePage par reviews + stars dikhte hain
```

---

# ═══════════════════════════════
# BACKEND — 4 FILES
# ═══════════════════════════════

---

## FILE 1 — `server/db/schema/reviews.js`

```js
const { pgTable, uuid, integer, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');
const { sessions } = require('./sessions');

const reviewTypeEnum = pgEnum('review_type', ['session', 'exchange']);

const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  reviewerId: uuid('reviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: uuid('reviewee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  exchangeId: uuid('exchange_id')
    .references(() => exchanges.id, { onDelete: 'set null' }),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'set null' }),
  type: reviewTypeEnum('type').default('session'),
  rating: integer('rating').notNull(),  // 1 to 5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { reviews, reviewTypeEnum };
```

---

## FILE 2 — `server/db/schema/index.js` mein sirf ye 2 lines add karo

```js
// Top pe imports mein:
const { reviews, reviewTypeEnum } = require('./reviews');

// module.exports mein:
module.exports = {
  // ... baaki sab same rehta hai ...
  reviews,
  reviewTypeEnum,
};
```

---

## FILE 3 — `server/controllers/reviewController.js`

```js
const { db } = require('../config/db');
const { reviews, users, profiles, exchanges } = require('../db/schema/index');
const { eq, and, desc } = require('drizzle-orm');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { revieweeId, exchangeId, sessionId, rating, comment, type } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Rating 1 se 5 ke beech honi chahiye' });

    if (revieweeId === req.user.id)
      return res.status(400).json({ message: 'Apne aap ko review nahi kar sakte' });

    // Exchange participant check
    if (exchangeId) {
      const [exchange] = await db
        .select()
        .from(exchanges)
        .where(eq(exchanges.id, exchangeId));

      if (!exchange)
        return res.status(404).json({ message: 'Exchange nahi mili' });

      const isParticipant =
        exchange.userAId === req.user.id || exchange.userBId === req.user.id;

      if (!isParticipant)
        return res.status(403).json({ message: 'Sirf exchange participants review kar sakte hain' });
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
      return res.status(400).json({ message: 'Is exchange ke liye review de chuke hain' });

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

    res.status(201).json({ message: 'Review submit ho gayi!', review });
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

    if (!review) return res.status(404).json({ message: 'Review nahi mili' });
    if (review.reviewerId !== req.user.id)
      return res.status(403).json({ message: 'Sirf apna review delete kar sakte ho' });

    await db.delete(reviews).where(eq(reviews.id, req.params.id));
    res.json({ message: 'Review delete ho gayi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews, getExchangeReviews, getMyReviews, deleteReview };
```

---

## FILE 4 — `server/routes/reviewRoutes.js`

```js
const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getExchangeReviews,
  getMyReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/my', protect, getMyReviews);
router.get('/user/:userId', protect, getUserReviews);
router.get('/exchange/:exchangeId', protect, getExchangeReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
```

---

## server.js mein confirm karo ye line hai:

```js
app.use('/api/reviews', require('./routes/reviewRoutes'));
```

---

## Migration:

```bash
cd server
npm run db:generate
npm run db:migrate
```

---

# ═══════════════════════════════
# FRONTEND — 4 FILES
# ═══════════════════════════════

---

## FILE 5 — `client/src/components/reviews/ReviewCard.jsx`

```jsx
import { Star, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={
          s <= rating
            ? 'text-amber-400 fill-amber-400'
            : 'text-gray-200 fill-gray-200'
        }
      />
    ))}
  </div>
);

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useSelector((s) => s.auth);
  const isOwner = user?.id === review.reviewer?.id;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
        {review.reviewer?.avatar ? (
          <img
            src={review.reviewer.avatar}
            alt={review.reviewer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          review.reviewer?.name?.[0]?.toUpperCase()
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-gray-900">
              {review.reviewer?.name}
            </span>
            <StarDisplay rating={review.rating} />
          </div>

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {review.comment && (
          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          {new Date(review.createdAt).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
```

---

## FILE 6 — `client/src/components/reviews/ReviewModal.jsx`

```jsx
import { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const labels = {
  1: 'Bahut bura 😞',
  2: 'Theek nahi tha 😕',
  3: 'Theek tha 😐',
  4: 'Acha tha 😊',
  5: 'Zabardast! 🌟',
};

const ReviewModal = ({ exchange, revieweeId, revieweeName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error('Pehle stars select karo');
    setLoading(true);
    try {
      await api.post('/reviews', {
        revieweeId,
        exchangeId: exchange.id,
        rating,
        comment,
        type: 'exchange',
      });
      toast.success('Review submit ho gayi! ⭐');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review submit nahi hui');
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Review Likho</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Reviewee */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
              {revieweeName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400">Aap review kar rahe ho</p>
              <p className="font-semibold text-gray-900">{revieweeName}</p>
            </div>
          </div>

          {/* Stars */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Rating do</p>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      s <= (hovered || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }
                  />
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p className="text-center text-sm text-gray-500">
                {labels[hovered || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Experience share karo..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-brand/90 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send size={15} /> Submit</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
```

---

## FILE 7 — ExchangesPage.jsx mein changes

> Sirf ye cheezein add karo existing file mein

```jsx
// 1. IMPORTS mein add karo
import { useState } from 'react'; // already hoga
import { Star } from 'lucide-react';
import ReviewModal from '../components/reviews/ReviewModal';
import { useSelector } from 'react-redux'; // already hoga

// 2. Component ke andar state add karo
const { user } = useSelector((s) => s.auth);
const [reviewModal, setReviewModal] = useState(null);

// 3. Exchange card mein ye button add karo
//    (jahan exchange.status === 'completed' ho wahan)
{exchange.status === 'completed' && (
  <button
    onClick={() =>
      setReviewModal({
        exchange,
        revieweeId:
          exchange.userAId === user?.id
            ? exchange.userBId
            : exchange.userAId,
        revieweeName:
          exchange.userAId === user?.id
            ? exchange.userB?.name
            : exchange.userA?.name,
      })
    }
    className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition font-medium"
  >
    <Star size={12} fill="currentColor" /> Review Likho
  </button>
)}

// 4. return ke bilkul end mein add karo (closing div se pehle)
{reviewModal && (
  <ReviewModal
    exchange={reviewModal.exchange}
    revieweeId={reviewModal.revieweeId}
    revieweeName={reviewModal.revieweeName}
    onClose={() => setReviewModal(null)}
    onSuccess={() => dispatch(fetchExchanges())}
  />
)}
```

---

## FILE 8 — ProfilePage.jsx mein Reviews section add karo

```jsx
// 1. IMPORTS mein add karo
import { useEffect, useState } from 'react'; // already hoga
import { Star } from 'lucide-react';
import api from '../api/axios';
import ReviewCard from '../components/reviews/ReviewCard';
import toast from 'react-hot-toast';

// 2. State add karo
const [reviewData, setReviewData] = useState({
  reviews: [],
  averageRating: 0,
  total: 0,
});

// 3. useEffect mein fetch karo
//    profileUserId = jis user ka profile dekh rahe ho uska ID
useEffect(() => {
  if (!profileUserId) return;
  api
    .get(`/reviews/user/${profileUserId}`)
    .then(({ data }) => setReviewData(data))
    .catch(() => {});
}, [profileUserId]);

// 4. Delete handler
const handleDeleteReview = async (reviewId) => {
  try {
    await api.delete(`/reviews/${reviewId}`);
    setReviewData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== reviewId),
      total: prev.total - 1,
    }));
    toast.success('Review delete ho gayi');
  } catch {
    toast.error('Delete nahi hui');
  }
};

// 5. JSX mein add karo — profile card ke neeche
<div className="card mt-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-bold text-gray-900 flex items-center gap-2">
      <Star size={18} className="text-amber-400 fill-amber-400" />
      Reviews
    </h2>

    {reviewData.total > 0 && (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={
                s <= Math.round(reviewData.averageRating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              }
            />
          ))}
        </div>
        <span className="font-bold text-gray-800 text-sm">
          {reviewData.averageRating}
        </span>
        <span className="text-xs text-gray-400">
          ({reviewData.total})
        </span>
      </div>
    )}
  </div>

  {reviewData.reviews.length === 0 ? (
    <div className="text-center py-8 text-gray-400">
      <Star size={28} className="mx-auto mb-2 opacity-20" />
      <p className="text-sm">Abhi koi review nahi</p>
    </div>
  ) : (
    reviewData.reviews.map((review) => (
      <ReviewCard
        key={review.id}
        review={review}
        onDelete={handleDeleteReview}
      />
    ))
  )}
</div>
```

---

# ═══════════════════════════════
# SUMMARY — Kahan Kya
# ═══════════════════════════════

| File | Kya karna hai |
|------|---------------|
| `server/db/schema/reviews.js` | Naya file banao |
| `server/db/schema/index.js` | reviews import + export add karo |
| `server/controllers/reviewController.js` | Naya file banao |
| `server/routes/reviewRoutes.js` | Naya file banao |
| `server/server.js` | `/api/reviews` route register confirm karo |
| `client/src/components/reviews/ReviewCard.jsx` | Naya file banao |
| `client/src/components/reviews/ReviewModal.jsx` | Naya file banao |
| `client/src/pages/ExchangesPage.jsx` | Review button + Modal add karo |
| `client/src/pages/ProfilePage.jsx` | Reviews section add karo |
