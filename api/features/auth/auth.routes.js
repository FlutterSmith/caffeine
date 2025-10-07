/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { verifyToken } = require("./auth.middleware");
const { authLimiter } = require("../../shared/middleware/rateLimiter");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post("/register", authLimiter, (req, res) =>
  authController.register(req, res),
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", authLimiter, (req, res) =>
  authController.login(req, res),
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", verifyToken, (req, res) =>
  authController.getCurrentUser(req, res),
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", verifyToken, (req, res) =>
  authController.logout(req, res),
);

module.exports = router;
