// controllers/paymentController.js
const {
  createStripePaymentIntent,
  processJazzCashPayment,
  processEasyPaisaPayment,
} = require("../services/paymentService");
exports.createStripePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await createStripePaymentIntent(amount, currency);
    res.json({ paymentIntent });
  } catch (error) {
    console.error("Error creating Stripe payment intent:", error.message);
    res.status(500).send("Server error");
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
