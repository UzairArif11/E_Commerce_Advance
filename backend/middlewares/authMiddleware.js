// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");
// General authentication middleware to verify JWT token
exports.auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user;
    // Assuming payload: { user: { id: user.id } }
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
// Admin authentication middleware to verify user has admin role
exports.adminAuth = async (req, res, next) => {
  // First, ensure the user is authenticated
  await exports.auth(req, res, async () => {
    // Retrieve the user details from the database
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, admin only" });
    }
    next();
  });
};
