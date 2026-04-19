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