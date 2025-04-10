const userController = require('../controllers/userController');
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const validateRequest = require('../middlewares/validationMiddleware');
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
  module.exports = router;