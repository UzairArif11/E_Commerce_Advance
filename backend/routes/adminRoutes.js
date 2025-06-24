// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middlewares/authMiddleware");
  
// Only admin can broadcast
router.post('/broadcast', adminAuth, adminController.broadcastNotification);
// @route GET /api/admin/dashboard // @desc Get dashboard statistics // @access Protected (Admin)
router.get("/dashboard", adminAuth, adminController.getDashboardStats);
// @route GET /api/admin/orders // @desc Get orders statistics // @access Protected (Admin)
router.get("/orders", adminAuth, adminController.getAllOrders);
// @route GET /api/admin/users // @desc Get all users // @access Protected (Admin)
router.get("/users", adminAuth, adminController.getAllUsers);
// @route DELETE /api/admin/users/:id // @desc Delete a user // @access Protected (Admin)
router.delete("/users/:id", adminAuth, adminController.deleteUser);
module.exports = router;
