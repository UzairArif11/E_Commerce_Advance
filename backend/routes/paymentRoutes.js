// routes/paymentRoutes.js
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const validateRequest = require("../middlewares/validationMiddleware");
// @route POST /api/payments/stripe
// @desc Create a Stripe payment intent
// @access Protected (User)
router.post(
  "/stripe",
  [
    check("amount", "Amount is required and must be a number").isNumeric(),
    check("currency", "Currency is required").notEmpty(),
  ],
  validateRequest,
  paymentController.createStripePayment
); // @route POST /api/payments/jazzcash // @desc Process a JazzCash payment (placeholder) // @access Protected (User)
router.post("/jazzcash", paymentController.jazzCashPayment);
// @route POST /api/payments/easypaisa // @desc Process an EasyPaisa payment (placeholder) // @access Protected (User)
router.post("/easypaisa", paymentController.easyPaisaPayment);
module.exports = router;
