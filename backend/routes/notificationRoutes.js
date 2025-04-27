const express = require('express');
const { auth } = require('../middlewares/authMiddleware');
const { getUserNotifications, clearUserNotifications, markNotificationAsRead,markAllNotificationsAsRead } = require('../controllers/notificationController');
const router = express.Router();

router.get('/', auth, getUserNotifications);
router.delete('/clear', auth, clearUserNotifications);
router.put('/:id/read', auth, markNotificationAsRead);
router.put('/read/all', auth, markAllNotificationsAsRead);

module.exports = router;
