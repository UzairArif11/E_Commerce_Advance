// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const { getIO } = require('../socket');


exports.createOrder = async (req, res) => {
  const { user, products, shippingAddress, totalAmount } = req.body;

  try {
    // Use the user ID from the request or fallback to the authenticated user
    let orderUser;
    if (req.user.role !== 'admin'  ) {
      const userId = req.user.id;
      orderUser= userId;
    }else{
      orderUser = user;
    }
const userData = await User.findById(orderUser);
    if (!userData) return res.status(404).json({ msg: 'User not found' });
    // Create a new order instance
    const order = new Order({
      user: orderUser,
      products,
      shippingAddress,
      totalAmount,
    });

    await order.save();
  // After placing an 
  const io = getIO();
io.emit('orderPlaced', {
  message: `New order placed by ${userData.name}`,
  orderId: order._id,
});

await sendEmail({
  email: userData.email,
  subject: 'Order Confirmation - eShop',
  message: `
    <h1>Thank you for your order, ${userData.name}!</h1>
    <p>Your order has been placed successfully.</p>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
    <p>We will notify you when your order is shipped!</p>
    <br />
    <p>eShop Team</p>
    <h1>Thank you for shopping at <span style="color:blue;">eShop</span>!</h1> 
    <img src="https://your-logo-link.com/logo.png" alt="eShop Logo" width="100"/>
  `,
});

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
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id).populate('user', 'email name');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.status = status;
  await order.save();

  // If status changed to "shipped", send email
  if (status === 'shipped') {
    const io = getIO();
// After shipping an order
io.emit('orderShipped', {
  message: `Order shipped for ${order.user.name}`,
  orderId: order._id,
});
    await sendEmail({
      email: order.user.email,
      subject: "Your Order is Shipped - eShop 🚚",
      message: `
        <h1>Good news, ${order.user.name}!</h1>
        <h1 style="color: #4CAF50;">Your Package is on the Way! 🚚</h1>
        <p>Order ID: <strong>#${order._id}</strong></p>
        <p>Track your order status by logging into your profile.</p>
        <a 
          href="https://yourwebsite.com/profile" 
          style="
            background: #4CAF50; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          "
        >
          Track Order
        </a>
        <p style="margin-top: 20px;">
          Thanks for choosing <strong>eShop</strong>!
        </p>
      `,
    });
    
  }

  res.status(200).json({
    message: 'Order status updated',
    order,
  });
};

exports.cancelOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate('user', 'email name');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // if (order.status !== 'pending') {
  //   return res.status(400).json({ message: 'Cannot cancel, order already processed.' });
  // }

  order.status = 'cancelled';
  await order.save();
  const io = getIO();
  // After cancelling an order
io.emit('orderCancelled', {
  message: `Order cancelled by ${order.user.name}`,
  orderId: order._id,
});
  // Send Cancellation Email
  await sendEmail({
    email: order.user.email,
    subject: 'Order Cancelled - eShop',
    message: `
      <h1>Hello ${order.user.name},</h1>
      <p>We have successfully cancelled your order.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p>If you have already paid, refunds will be processed within 5-7 business days.</p>
      <br/>
      <p>We hope to serve you again soon!</p>
      <p><strong>eShop Team</strong></p>
    `,
  });

  res.status(200).json({ message: 'Order cancelled successfully', order });
};


 
