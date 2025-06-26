// routes/stripeWebhook.js
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { getIO } = require('../socket');
const Notification = require('../models/Notification');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Replace with your Stripe webhook secret from Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event;
console.log('Received Stripe webhook event:');
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers['stripe-signature'],
        endpointSecret
      );
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.sendStatus(400);
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object;
      const { userId, cartItems, shippingAddress } = intent.metadata;

      const parsedItems = JSON.parse(cartItems);

      const products = await Product.find({
        _id: { $in: parsedItems.map(item => item.productId) }
      });

      const productMap = new Map();
      products.forEach(p => productMap.set(p._id.toString(), p.price));

      const totalAmount = parsedItems.reduce((sum, item) => {
        const dbPrice = productMap.get(item.productId);
        return sum + (dbPrice || 0) * item.quantity;
      }, 0);
  
      const order = new Order({
        user: userId,
         products: parsedItems.map((item) => ({
              product: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
        totalAmount,
        shippingAddress,
        paymentMethod: 'Stripe',
        status: 'pending'
      });

      await order.save();
       const io = getIO();
      io.to(userId.toString()).emit(`user_strip`, {
      message: ` Order saved successfully after payment.`,
    });
 const userData = await User.findById(userId);
     await Notification.create({
          user: userId,
          type: "placed",
          message: `New order placed by ${userData.name}`,
        });
     
        io.to("admin").emit("admin_orderPlaced", {
          message: `New order placed by ${userData.name}`,
          orderId: order._id,
        });
        if (userData.wantsEmailNotifications) {
          await sendEmail({
            email: userData.email,
            subject: "Order Confirmation - eShop",
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
        }
      console.log('✅ Order saved successfully after payment.');
    }

    res.json({ received: true });
  }
);

module.exports = router;
