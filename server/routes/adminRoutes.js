const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, unbanUser, getAllReports, resolveReport, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.get('/reports', getAllReports);
router.put('/reports/:id/resolve', resolveReport);

module.exports = router;