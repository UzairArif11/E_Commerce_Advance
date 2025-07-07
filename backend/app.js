// app.js
const express = require('express');
const cors = require('cors');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const stripeWebhook = require('./routes/stripeWebhook');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingRoutes = require('./routes/settingRoutes');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');


const app = express();

// Connect to MongoDB
dbConnect();


// 👇 Apply raw middleware for Stripe BEFORE body parser
app.use('/api/stripeWebhook', express.raw({ type: 'application/json' }));

// 👇 Your normal body parser AFTER webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({ origin: 'https://e-commerce-advance-tau.vercel.app' })); 

app.use('/api/stripeWebhook', stripeWebhook);
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
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
// Error Handling Middleware
// After all your routes
app.use(notFound);
app.use(errorHandler);

module.exports = app;
