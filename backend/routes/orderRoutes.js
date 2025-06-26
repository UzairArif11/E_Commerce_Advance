// routes/orderRoutes.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateRequest = require('../middlewares/validationMiddleware');
const { auth,adminAuth } = require('../middlewares/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Protected (User)
router.post(
  '/',
  [
    // check('user', 'User ID is required').notEmpty(),
    check('products', 'Products array is required and cannot be empty').isArray({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').notEmpty(),
    check('paymentMethod', 'paymentMethod is required').notEmpty(),
    check('totalAmount', 'Total amount must be a number greater than 0').isFloat({ gt: 0 }),
  ],
  auth,
  validateRequest,
  orderController.createOrder
);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Protected (User/Admin)
router.get('/:id', auth, orderController.getOrderById);

// @route   GET /api/orders/user/:userId
// @desc    Get all orders for a specific user
// @access  Protected (User/Admin)
router.get('/user/:userId', auth,orderController.getUserOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (e.g., pending to shipped)
// @access  Protected (Admin)
router.put(
  '/:id/status',
  [
    check('status', 'Status must be one of: pending, shipped, delivered, cancelled')
      .isIn(['pending', 'shipped', 'delivered', 'cancelled']),
  ],
  validateRequest,  adminAuth,
  orderController.updateOrderStatus
);
router.put('/:id/cancel',  auth, orderController.cancelOrder);

module.exports = router;
