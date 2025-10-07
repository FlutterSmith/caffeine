/**
 * Payments Module Exports
 * Central export point for payments module
 */

const paymentsRoutes = require("./payments.routes");
const paymentsController = require("./payments.controller");
const paymentsService = require("./payments.service");

module.exports = {
  paymentsRoutes,
  paymentsController,
  paymentsService,
};
