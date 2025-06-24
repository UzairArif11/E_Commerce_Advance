// controllers/adminController.js
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require('../models/Notification');
const { getIO } = require('../socket');

exports.broadcastNotification = async (req, res) => {
  const { message } = req.body;

  const users = await User.find({});

  // Save notification for all users
  for (const user of users) {
    await Notification.create({
      user: user._id,
      type: 'broadcast',
      message,
    });
    const io = getIO();
    // Emit live notification to connected users
    console.log(`Broadcasting notification to user ${user._id},message: ${message}`);
    io.to(user._id.toString()).emit(`user_broadcast`, {
      message,
    });

  }

  res.json({ message: 'Notification broadcasted to all users.' });
};


exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const productCount = await Product.countDocuments();
    // Calculate total sales from orders with successful payment
    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalSales = paidOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    res.json({ userCount, orderCount, productCount, totalSales });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    .populate('products.product', 'name price')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // await user.remove();
     await user.deleteOne({ _id: req.params.id });
    res.json({ msg: "User removed" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
