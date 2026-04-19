const express = require('express');
const router = express.Router();
const { getSettings, updateName, changePassword, deleteAccount } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSettings);
router.put('/name', protect, updateName);
router.put('/password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;