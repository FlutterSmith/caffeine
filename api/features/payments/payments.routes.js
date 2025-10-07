/**
 * Payments Routes
 * Defines all payment-related endpoints
 */

const express = require("express");
const router = express.Router();
const paymentsController = require("./payments.controller");
const {
  paymentLimiter,
  webhookLimiter,
} = require("../../shared/middleware/rateLimiter");

/**
 * @route   POST /api/payment/create-intent
 * @desc    Create payment intent
 * @access  Public (should be Private in production)
 */
router.post("/create-intent", paymentLimiter, (req, res) =>
  paymentsController.createPaymentIntent(req, res),
);

/**
 * @route   POST /api/payment/confirm
 * @desc    Confirm payment
 * @access  Public (should be Private in production)
 */
router.post("/confirm", paymentLimiter, (req, res) =>
  paymentsController.confirmPayment(req, res),
);

/**
 * @route   POST /api/payment/refund
 * @desc    Process refund
 * @access  Public (should be Private/Admin in production)
 */
router.post("/refund", paymentLimiter, (req, res) =>
  paymentsController.processRefund(req, res),
);

/**
 * @route   POST /api/payment/webhook
 * @desc    Handle Stripe webhook
 * @access  Public (Stripe only)
 */
router.post(
  "/webhook",
  webhookLimiter,
  express.raw({ type: "application/json" }),
  (req, res) => paymentsController.handleWebhook(req, res),
);

/**
 * @route   GET /api/payment/:id
 * @desc    Get payment details
 * @access  Public (should be Private in production)
 */
router.get("/:id", paymentLimiter, (req, res) =>
  paymentsController.getPaymentDetails(req, res),
);

module.exports = router;
