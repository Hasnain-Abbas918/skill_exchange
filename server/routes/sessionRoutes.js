const express = require('express');
const router = express.Router();
const { startSession, endSession, getSessionByRoom } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:id/start', protect, startSession);
router.put('/:id/end', protect, endSession);
router.get('/room/:roomId', protect, getSessionByRoom);

module.exports = router;