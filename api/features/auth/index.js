/**
 * Auth Module Exports
 * Central export point for authentication module
 */

const authRoutes = require("./auth.routes");
const authController = require("./auth.controller");
const authService = require("./auth.service");
const authMiddleware = require("./auth.middleware");

module.exports = {
  authRoutes,
  authController,
  authService,
  authMiddleware,
};
