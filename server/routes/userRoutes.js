const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, getUserProfile, uploadAvatar, upload } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.get('/:id/profile', protect, getUserProfile);

module.exports = router;