const express = require('express');
const router = express.Router();
const { getRequestHistory, getSessionHistory, getActivityTimeline, getHistorySummary } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/requests', protect, getRequestHistory);
router.get('/sessions', protect, getSessionHistory);
router.get('/activity', protect, getActivityTimeline);
router.get('/summary', protect, getHistorySummary);

module.exports = router;