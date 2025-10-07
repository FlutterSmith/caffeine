/**
 * Payments Service
 * Business logic for payment processing with Stripe
 */

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class PaymentsService {
  /**
   * Create a payment intent
   * @param {number} amount - Amount in dollars
   * @param {string} currency - Currency code (default: 'usd')
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    if (!amount || amount <= 0) {
      throw new Error("Amount is required and must be greater than 0");
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error("Stripe payment intent creation error:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  /**
   * Confirm payment and check status
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment confirmation result
   */
  async confirmPayment(paymentIntentId) {
    if (!paymentIntentId) {
      throw new Error("Payment intent ID is required");
    }

    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: paymentIntent.status === "succeeded",
        message:
          paymentIntent.status === "succeeded"
            ? "Payment successful"
            : "Payment not completed",
        status: paymentIntent.status,
        paymentIntent,
      };
    } catch (error) {
      console.error("Stripe payment confirmation error:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  /**
   * Process refund
   * @param {string} paymentIntentId - Payment intent ID
   * @param {number} amount - Amount to refund (optional, full refund if not specified)
   * @returns {Promise<Object>} Refund details
   */
  async processRefund(paymentIntentId, amount = null) {
    if (!paymentIntentId) {
      throw new Error("Payment intent ID is required");
    }

    try {
      const refundData = {
        payment_intent: paymentIntentId,
      };

      // Partial refund if amount specified
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        success: true,
        message: "Refund processed successfully",
        refund,
      };
    } catch (error) {
      console.error("Stripe refund error:", error);
      throw new Error("Failed to process refund");
    }
  }

  /**
   * Handle Stripe webhook event
   * @param {Object} rawBody - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Promise<Object>} Event handling result
   */
  async handleWebhook(rawBody, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Webhook secret not configured");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );

      // Handle different event types
      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(event.data.object);
          break;

        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(event.data.object);
          break;

        case "charge.refunded":
          await this.handleRefund(event.data.object);
          break;

        default:
          console.log("Unhandled event type:", event.type);
      }

      return { received: true, eventType: event.type };
    } catch (error) {
      console.error("Webhook error:", error);
      throw new Error("Webhook signature verification failed");
    }
  }

  /**
   * Handle successful payment
   * @param {Object} paymentIntent - Payment intent object
   * @private
   */
  async handlePaymentSuccess(paymentIntent) {
    console.log("Payment succeeded:", paymentIntent.id);
    // In production:
    // - Update order status
    // - Send confirmation email
    // - Trigger fulfillment process
  }

  /**
   * Handle failed payment
   * @param {Object} paymentIntent - Payment intent object
   * @private
   */
  async handlePaymentFailure(paymentIntent) {
    console.log("Payment failed:", paymentIntent.id);
    // In production:
    // - Notify customer
    // - Update order status
    // - Log failure reason
  }

  /**
   * Handle refund
   * @param {Object} charge - Charge object
   * @private
   */
  async handleRefund(charge) {
    console.log("Refund processed:", charge.id);
    // In production:
    // - Update order status
    // - Notify customer
    // - Update inventory
  }

  /**
   * Get payment details
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentDetails(paymentIntentId) {
    if (!paymentIntentId) {
      throw new Error("Payment intent ID is required");
    }

    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error("Failed to get payment details:", error);
      throw new Error("Failed to retrieve payment details");
    }
  }
}

module.exports = new PaymentsService();
