/**
 * Caffeine Coffee Shop - Backend API Server
 * Node.js/Express server for handling authentication and orders
 *
 * To run this server:
 * 1. Install dependencies: npm install express cors dotenv bcryptjs jsonwebtoken stripe
 * 2. Create .env file with required environment variables
 * 3. Run: node api/server.js
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Feature modules
const { authRoutes } = require("./features/auth");
const { ordersRoutes } = require("./features/orders");
const { paymentsRoutes } = require("./features/payments");

// Shared middleware
const { generalLimiter } = require("./shared/middleware/rateLimiter");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - important for Railway and other cloud platforms
app.set("trust proxy", 1);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all routes
app.use("/api/", generalLimiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Caffeine API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Caffeine API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
