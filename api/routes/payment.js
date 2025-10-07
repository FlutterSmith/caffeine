/**
 * Payment Routes - Stripe Integration
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create payment intent
 * POST /api/payment/create-intent
 */
router.post('/create-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});

/**
 * Confirm payment
 * POST /api/payment/confirm
 */
router.post('/confirm', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        // Retrieve payment intent to check status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            res.json({
                success: true,
                message: 'Payment successful',
                paymentIntent
            });
        } else {
            res.json({
                success: false,
                message: 'Payment not completed',
                status: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Payment confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

/**
 * Create refund
 * POST /api/payment/refund
 */
router.post('/refund', async (req, res) => {
    try {
        const { paymentIntentId, amount } = req.body;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }

        const refundData = {
            payment_intent: paymentIntentId
        };

        // Partial refund if amount specified
        if (amount) {
            refundData.amount = Math.round(amount * 100);
        }

        const refund = await stripe.refunds.create(refundData);

        res.json({
            success: true,
            message: 'Refund processed successfully',
            refund
        });

    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({ error: 'Failed to process refund' });
    }
});

/**
 * Stripe webhook handler
 * POST /api/payment/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log('Payment succeeded:', paymentIntent.id);
                // Update order status, send confirmation email, etc.
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                console.log('Payment failed:', failedPayment.id);
                // Notify customer, update order status
                break;

            case 'charge.refunded':
                const refund = event.data.object;
                console.log('Refund processed:', refund.id);
                // Update order status, notify customer
                break;

            default:
                console.log('Unhandled event type:', event.type);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: 'Webhook signature verification failed' });
    }
});

module.exports = router;
