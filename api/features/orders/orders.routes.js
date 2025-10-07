/**
 * Orders Routes
 * Defines all order-related endpoints
 */

const express = require("express");
const router = express.Router();
const ordersController = require("./orders.controller");
const {
  orderLimiter,
  readOnlyLimiter,
} = require("../../shared/middleware/rateLimiter");

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Public (should be Private in production)
 */
router.post("/", orderLimiter, (req, res) =>
  ordersController.createOrder(req, res),
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Public (should be Private in production)
 */
router.get("/:id", readOnlyLimiter, (req, res) =>
  ordersController.getOrder(req, res),
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (with optional filters)
 * @access  Public (should be Private/Admin in production)
 */
router.get("/", readOnlyLimiter, (req, res) =>
  ordersController.getAllOrders(req, res),
);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Public (should be Private/Admin in production)
 */
router.patch("/:id/status", orderLimiter, (req, res) =>
  ordersController.updateOrderStatus(req, res),
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel order
 * @access  Public (should be Private in production)
 */
router.delete("/:id", orderLimiter, (req, res) =>
  ordersController.cancelOrder(req, res),
);

module.exports = router;
