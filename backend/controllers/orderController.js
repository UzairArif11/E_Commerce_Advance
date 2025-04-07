// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { user, products, shippingAddress, totalAmount } = req.body;
  try {
    // Create a new order instance
    const order = new Order({ user, products, shippingAddress, totalAmount });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err.message);
    res.status(500).send('Server error');
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err.message);
    res.status(500).send('Server error');
  }
};
