// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { sendOTPEmail } = require('../services/emailService');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Create new user instance
    user = new User({ name, email, password });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate OTP and set expiry (10 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

    // Save the user to the database
    await user.save();

    // Send OTP Email for verification
    await sendOTPEmail(email, otp);

    res.json({ msg: 'Registration successful. Please verify your email using the OTP sent to your email.' });
  } catch (err) {
    console.error('Error in signup:', err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ errors: [{ msg: 'Please verify your email before logging in.' }] });
    }
    const { password: _, ...other } = user.toObject();

    // Generate JWT Token for the authenticated user
    const payload = { user: { _id: user.id } };
    jwt.sign(payload, config.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token ,user: other});
    });
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }
    if (user.isVerified) {
      return res.status(400).json({ errors: [{ msg: 'Email already verified' }] });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ errors: [{ msg: 'Invalid or expired OTP' }] });
    }

    // Mark email as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Error in email verification:', err.message);
    res.status(500).send('Server error');
  }
};
