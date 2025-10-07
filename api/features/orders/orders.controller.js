/**
 * Orders Controller
 * Handles HTTP requests for orders
 */

const ordersService = require("./orders.service");

class OrdersController {
  /**
   * Create new order
   * POST /api/orders
   */
  async createOrder(req, res) {
    try {
      const order = ordersService.createOrder(req.body);

      res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      console.error("Order creation error:", error);

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Failed to create order",
      });
    }
  }

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  async getOrder(req, res) {
    try {
      const order = ordersService.getOrderById(req.params.id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ error: "Failed to get order" });
    }
  }

  /**
   * Get all orders
   * GET /api/orders
   */
  async getAllOrders(req, res) {
    try {
      // Get filters from query params
      const filters = {
        status: req.query.status,
        customer: req.query.customer,
      };

      const allOrders = ordersService.getAllOrders(filters);

      res.json({
        orders: allOrders,
        total: allOrders.length,
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  }

  /**
   * Update order status
   * PATCH /api/orders/:id/status
   */
  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;
      const order = ordersService.updateOrderStatus(req.params.id, status);

      res.json({
        message: "Order status updated",
        order,
      });
    } catch (error) {
      console.error("Update status error:", error);

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Failed to update order status",
      });
    }
  }

  /**
   * Cancel order
   * DELETE /api/orders/:id
   */
  async cancelOrder(req, res) {
    try {
      const order = ordersService.cancelOrder(req.params.id);

      res.json({
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      console.error("Cancel order error:", error);

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Failed to cancel order",
      });
    }
  }

  /**
   * Get order statistics
   * GET /api/orders/stats
   */
  async getOrderStats(req, res) {
    try {
      const stats = ordersService.getOrderStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get order statistics" });
    }
  }
}

module.exports = new OrdersController();
