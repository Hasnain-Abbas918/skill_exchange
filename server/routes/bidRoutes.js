const express = require('express');
const router = express.Router();
const { createBid, getAllBids, getMyBids, getBidById, updateBid, deleteBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllBids).post(protect, createBid);
router.get('/my', protect, getMyBids);
router.route('/:id').get(protect, getBidById).put(protect, updateBid).delete(protect, deleteBid);

module.exports = router;