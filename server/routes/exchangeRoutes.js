const express = require('express');
const router = express.Router();
const { getMyExchanges, getExchangeById, requestPause, confirmPause, resumeExchange, requestCancel, approveCancel } = require('../controllers/exchangeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyExchanges);
router.get('/:id', protect, getExchangeById);
router.put('/:id/pause-request', protect, requestPause);
router.put('/:id/pause-confirm', protect, confirmPause);
router.put('/:id/resume', protect, resumeExchange);
router.put('/:id/cancel-request', protect, requestCancel);     // ✅ UPDATED: Step 1
router.put('/:id/cancel-approve', protect, approveCancel);     // ✅ NEW: Step 2 (mutual)

module.exports = router;