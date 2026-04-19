const express = require('express');
const router = express.Router();
const { getOverlapSlots, scheduleSession, getExchangeSessions } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overlap/:exchangeId', protect, getOverlapSlots);
router.post('/session', protect, scheduleSession);
router.get('/sessions/:exchangeId', protect, getExchangeSessions);

module.exports = router;