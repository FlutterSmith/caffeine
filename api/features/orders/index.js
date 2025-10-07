/**
 * Orders Module Exports
 * Central export point for orders module
 */

const ordersRoutes = require("./orders.routes");
const ordersController = require("./orders.controller");
const ordersService = require("./orders.service");

module.exports = {
  ordersRoutes,
  ordersController,
  ordersService,
};
