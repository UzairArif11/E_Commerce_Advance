// routes/productRoutes.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');
const validateRequest = require('../middlewares/validationMiddleware');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Add a new product
// @access  Protected (Admin)
// Note: Admin middleware can be added later for access control
router.post(
  '/',
  [
    check('name', 'Product name is required').notEmpty(),
    check('description', 'Product description is required').notEmpty(),
    check('price', 'Price must be a number greater than 0').isFloat({ gt: 0 }),
    check('category', 'Product category is required').notEmpty(),
  ],
  validateRequest,
  productController.addProduct
);

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Protected (Admin)
router.put(
  '/:id',
  [
    check('name', 'Product name is required').optional().notEmpty(),
    check('description', 'Product description is required').optional().notEmpty(),
    check('price', 'Price must be a number greater than 0').optional().isFloat({ gt: 0 }),
    check('category', 'Product category is required').optional().notEmpty(),
  ],
  validateRequest,
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Protected (Admin)
router.delete('/:id', productController.deleteProduct);

module.exports = router;

