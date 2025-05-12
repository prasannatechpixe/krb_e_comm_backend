
const Notification = require('../models/notificationModel');

// Create a new Notification
exports.createNotification = async (req, res) => {
  try {
    const newItem = await Notification.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all Notifications
exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.findAll();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single Notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const item = await Notification.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Notification by ID
exports.updateNotification = async (req, res) => {
  try {
    const [updated] = await Notification.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'Notification not found' });
    const updatedItem = await Notification.findByPk(req.params.id);
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
