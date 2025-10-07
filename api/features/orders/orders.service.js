/**
 * Orders Service
 * Business logic for order management
 */

// In-memory order storage (use database in production)
const orders = new Map();

class OrdersService {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Object} Created order
   */
  createOrder(orderData) {
    const { customer, address, items, deliveryType, notes, pricing } =
      orderData;

    // Validation
    if (!customer || !address || !items || items.length === 0) {
      throw new Error("Missing required order information");
    }

    // Create order
    const order = {
      id: "CAFF" + Date.now().toString().slice(-8),
      customer,
      address,
      items,
      deliveryType,
      notes,
      pricing,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.set(order.id, order);

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify kitchen/staff
    // 4. Create delivery task if needed

    return order;
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order or null if not found
   */
  getOrderById(orderId) {
    return orders.get(orderId) || null;
  }

  /**
   * Get all orders with optional filters
   * @param {Object} filters - Filter options (status, customer, etc.)
   * @returns {Array} List of orders
   */
  getAllOrders(filters = {}) {
    let allOrders = Array.from(orders.values());

    // Apply filters if provided
    if (filters.status) {
      allOrders = allOrders.filter((order) => order.status === filters.status);
    }

    if (filters.customer) {
      allOrders = allOrders.filter(
        (order) =>
          order.customer.email === filters.customer ||
          order.customer.phone === filters.customer,
      );
    }

    // Sort by creation date (newest first)
    allOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return allOrders;
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status
   * @returns {Object} Updated order
   */
  updateOrderStatus(orderId, newStatus) {
    const order = orders.get(orderId);

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "delivering",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(newStatus)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      throw error;
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    orders.set(order.id, order);

    // In production, send notification to customer about status update

    return order;
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Object} Cancelled order
   */
  cancelOrder(orderId) {
    const order = orders.get(orderId);

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    if (order.status !== "pending") {
      const error = new Error("Cannot cancel order in current status");
      error.statusCode = 400;
      throw error;
    }

    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();

    orders.set(order.id, order);

    return order;
  }

  /**
   * Delete order (soft delete by cancelling)
   * @param {string} orderId - Order ID
   * @returns {Object} Deleted order
   */
  deleteOrder(orderId) {
    return this.cancelOrder(orderId);
  }

  /**
   * Get order statistics
   * @returns {Object} Order statistics
   */
  getOrderStats() {
    const allOrders = Array.from(orders.values());

    return {
      total: allOrders.length,
      pending: allOrders.filter((o) => o.status === "pending").length,
      preparing: allOrders.filter((o) => o.status === "preparing").length,
      ready: allOrders.filter((o) => o.status === "ready").length,
      delivering: allOrders.filter((o) => o.status === "delivering").length,
      delivered: allOrders.filter((o) => o.status === "delivered").length,
      cancelled: allOrders.filter((o) => o.status === "cancelled").length,
    };
  }
}

module.exports = new OrdersService();
