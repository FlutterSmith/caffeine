/**
 * Orders Routes
 */

const express = require('express');
const router = express.Router();

// In-memory order storage (use database in production)
const orders = new Map();

/**
 * Create new order
 * POST /api/orders
 */
router.post('/', async (req, res) => {
    try {
        const { customer, address, items, deliveryType, notes, pricing } = req.body;

        // Validation
        if (!customer || !address || !items || items.length === 0) {
            return res.status(400).json({ error: 'Missing required order information' });
        }

        // Create order
        const order = {
            id: 'CAFF' + Date.now().toString().slice(-8),
            customer,
            address,
            items,
            deliveryType,
            notes,
            pricing,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        orders.set(order.id, order);

        // In production, you would:
        // 1. Save to database
        // 2. Send confirmation email
        // 3. Notify kitchen/staff
        // 4. Create delivery task if needed

        res.status(201).json({
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

/**
 * Get order by ID
 * GET /api/orders/:id
 */
router.get('/:id', (req, res) => {
    const order = orders.get(req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

/**
 * Get all orders (for admin/staff)
 * GET /api/orders
 */
router.get('/', (req, res) => {
    const allOrders = Array.from(orders.values());

    // In production, add pagination and filtering
    res.json({
        orders: allOrders,
        total: allOrders.length
    });
});

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
router.patch('/:id/status', (req, res) => {
    const order = orders.get(req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    orders.set(order.id, order);

    // In production, send notification to customer about status update

    res.json({
        message: 'Order status updated',
        order
    });
});

/**
 * Cancel order
 * DELETE /api/orders/:id
 */
router.delete('/:id', (req, res) => {
    const order = orders.get(req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'pending') {
        return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    orders.set(order.id, order);

    res.json({
        message: 'Order cancelled successfully',
        order
    });
});

module.exports = router;
