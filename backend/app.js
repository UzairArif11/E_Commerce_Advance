// app.js
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


const app = express();

// Connect to MongoDB
dbConnect();

// Global Middlewares
app.use(express.json());
app.use(cors());

// Base Route
app.get('/', (req, res) => {
  res.send('eCommerce API is up and running');
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
// Error Handling Middleware
// After all your routes
app.use(notFound);
app.use(errorHandler);

module.exports = app;
