const Notification = require('../models/Notification');

const getUserNotifications = async (req, res) => {

  const notifications = await Notification.find({ user: req.user._id}).sort({ createdAt: -1 });
  res.json(notifications);
};

const clearUserNotifications = async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });
  res.json({ message: 'Notifications cleared' });
};
const markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  if (notification.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  notification.read = true;
  await notification.save();

  res.json({ message: 'Notification marked as read' });
};
const markAllNotificationsAsRead = async (req, res) => {
  try {
    // Update all notifications for the current user that are not already read
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while marking all notifications as read' });
  }
};


module.exports = {
  getUserNotifications,
  clearUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};

