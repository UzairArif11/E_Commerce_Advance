# E_Commerce_Advance
ecommerce-backend/
├── config/
│   ├── db.js           // MongoDB connection setup
│   └── env.js          // Environment variables configuration
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js   // Custom middleware for express-validator errors handling
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Category.js
│   └── Payment.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── services/
│   ├── emailService.js   // For sending verification OTPs and notifications via NodeMailer
│   └── paymentService.js // Handling Stripe, JazzCash, EasyPaisa payments
├── utils/
│   └── logger.js         // For logging errors and events
├── app.js                // Express app configuration
├── server.js             // Server startup script
├── package.json
└── .env                  // Environment variables file (do not commit this file)
