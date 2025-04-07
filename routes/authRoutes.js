// routes/authRoutes.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validationMiddleware');

// @route   POST /api/auth/signup
// @desc    Register a new user and send OTP for email verification
// @access  Public
router.post(
  '/signup',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  validateRequest,
  authController.signup
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validateRequest,
  authController.login
);

// @route   POST /api/auth/verify-email
// @desc    Verify user's email using OTP
// @access  Public
router.post(
  '/verify-email',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('otp', 'OTP is required').notEmpty(),
  ],
  validateRequest,
  authController.verifyEmail
);

module.exports = router;
