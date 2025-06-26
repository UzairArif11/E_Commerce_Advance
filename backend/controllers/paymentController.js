// controllers/paymentController.js
const Product = require("../models/Product");
const {
  createStripePaymentIntent,
  processJazzCashPayment,
  processEasyPaisaPayment,
} = require("../services/paymentService");

exports.createStripePayment = async (req, res) => {
  const { cartItems, currency ,shippingAddress} = req.body;

  try {
    // Get product prices from DB
          const userId = req.user._id;
    const products = await Product.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });

    // Create map of productId -> price from DB
    const productMap = new Map();
    products.forEach((product) => {
      productMap.set(product._id.toString(), product.price);
    });
     // Calculate total using DB price instead of frontend-sent price
    const totalAmount = cartItems.reduce((sum, item) => {
      const dbPrice = productMap.get(item.productId);
      return sum + (dbPrice || 0) * item.quantity;
    }, 0);

    console.log('Total amount from DB:', totalAmount);

    const paymentIntent = await createStripePaymentIntent(
      totalAmount * 100,
      currency,
        {
        userId,
        cartItems: JSON.stringify(cartItems),
        shippingAddress
      },
);

    res.json({ paymentIntent });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error.message);
    res.status(500).send('Server error');
  }
};
exports.jazzCashPayment = async (req, res) => {
  const paymentData = req.body;
  try {
    const result = await processJazzCashPayment(paymentData);
    res.json(result);
  } catch (error) {
    console.error("Error processing JazzCash payment:", error.message);
    res.status(500).send("Server error");
  }
};
exports.easyPaisaPayment = async (req, res) => {
  const paymentData = req.body;
  try {
    const result = await processEasyPaisaPayment(paymentData);
    res.json(result);
  } catch (error) {
    console.error("Error processing EasyPaisa payment:", error.message);
    res.status(500).send("Server error");
  }
};

//  exports.createStripeSession = async (req, res) => {
  // const { orderItems, totalAmount } = req.body;

  // try {
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     line_items: orderItems.map((item) => ({
  //       price_data: {
  //         currency: 'usd',
  //         product_data: {
  //           name: item.name,
  //         },
  //         unit_amount: Math.round(item.price * 100),
  //       },
  //       quantity: item.quantity,
  //     })),
  //     mode: 'payment',
  //     success_url: `${process.env.FRONTEND_URL}/success`,
  //     cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  //   });

  //   res.json({ id: session.id });
  // } catch (error) {
  //   console.error('Stripe Error:', error);
  //   res.status(500).json({ message: error.message });
  // }
// };