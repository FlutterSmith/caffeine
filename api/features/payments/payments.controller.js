/**
 * Payments Controller
 * Handles HTTP requests for payment processing
 */

const paymentsService = require("./payments.service");

class PaymentsController {
  /**
   * Create payment intent
   * POST /api/payment/create-intent
   */
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency = "usd", metadata } = req.body;

      const result = await paymentsService.createPaymentIntent(
        amount,
        currency,
        metadata,
      );

      res.json(result);
    } catch (error) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({
        error: error.message || "Failed to create payment intent",
      });
    }
  }

  /**
   * Confirm payment
   * POST /api/payment/confirm
   */
  async confirmPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;

      const result = await paymentsService.confirmPayment(paymentIntentId);

      res.json(result);
    } catch (error) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({
        error: error.message || "Failed to confirm payment",
      });
    }
  }

  /**
   * Process refund
   * POST /api/payment/refund
   */
  async processRefund(req, res) {
    try {
      const { paymentIntentId, amount } = req.body;

      const result = await paymentsService.processRefund(
        paymentIntentId,
        amount,
      );

      res.json(result);
    } catch (error) {
      console.error("Refund error:", error);
      res.status(500).json({
        error: error.message || "Failed to process refund",
      });
    }
  }

  /**
   * Handle Stripe webhook
   * POST /api/payment/webhook
   */
  async handleWebhook(req, res) {
    try {
      const signature = req.headers["stripe-signature"];

      const result = await paymentsService.handleWebhook(req.body, signature);

      res.json(result);
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({
        error: error.message || "Webhook signature verification failed",
      });
    }
  }

  /**
   * Get payment details
   * GET /api/payment/:id
   */
  async getPaymentDetails(req, res) {
    try {
      const paymentIntent = await paymentsService.getPaymentDetails(
        req.params.id,
      );

      res.json(paymentIntent);
    } catch (error) {
      console.error("Get payment details error:", error);
      res.status(500).json({
        error: error.message || "Failed to retrieve payment details",
      });
    }
  }
}

module.exports = new PaymentsController();
