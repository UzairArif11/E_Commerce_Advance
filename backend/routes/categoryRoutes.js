// routes/categoryRoutes.js
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { adminAuth } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validationMiddleware");

// @route GET /api/categories // @desc Get all categories // @access Public
 router.get('/', categoryController.getAllCategories);
// @route POST /api/categories // @desc Add a new category // @access Protected (Admin)
router.post(
  "/",
  adminAuth,
  [check("name", "Category name is required").notEmpty()],
  validateRequest,
  categoryController.addCategory
);
// @route PUT /api/categories/:id // @desc Update a category // @access Protected (Admin)
router.put(
  "/:id",
  adminAuth,
  [check("name", "Category name is required").optional().notEmpty()],
  validateRequest,
  categoryController.updateCategory
);
// @route DELETE /api/categories/:id // @desc Delete a category // @access Protected (Admin)
router.delete("/:id", adminAuth, categoryController.deleteCategory);
// @route GET /api/categories/:id // @desc Get a category by ID // @access Public
router.get("/:id", categoryController.getCategoryById);
module.exports = router;
