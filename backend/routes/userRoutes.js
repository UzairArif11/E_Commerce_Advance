const userController = require('../controllers/userController');
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const validateRequest = require('../middlewares/validationMiddleware');
const { auth } = require('../middlewares/authMiddleware');

// User settings and profile routes
router.get('/cart', auth, userController.getCart);
router.put('/settings', auth, userController.updateUserSettings);
router.put(
    "/:id",
    [
      check("name", "Name is required").optional().notEmpty(),
      check("email", "Please include a valid email").optional().isEmail(),
      check("password", "Password must be at least 6 characters").optional().isLength({ min: 6 }),
    ],
    validateRequest,
    userController.updateUser
  );

// Cart routes
router.post('/cart/add', auth, [
  check('productId', 'Product ID is required').notEmpty(),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], validateRequest, userController.addToCart);
router.put('/cart/update', auth, [
  check('productId', 'Product ID is required').notEmpty(),
  check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], validateRequest, userController.updateCartItem);
router.delete('/cart/remove/:productId', auth, userController.removeFromCart);
router.delete('/cart/clear', auth, userController.clearCart);

// Wishlist routes
router.get('/wishlist', auth, userController.getWishlist);
router.post('/wishlist/add', auth, [
  check('productId', 'Product ID is required').notEmpty()
], validateRequest, userController.addToWishlist);
router.delete('/wishlist/remove/:productId', auth, userController.removeFromWishlist);
// router.delete('/wishlist/clear', auth, userController.clearWishlist);

module.exports = router;
