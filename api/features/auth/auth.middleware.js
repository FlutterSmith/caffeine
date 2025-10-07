/**
 * Authentication Middleware
 * Middleware functions for authentication
 */

const authService = require("./auth.service");

/**
 * Middleware to verify JWT token
 */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message || "Invalid token" });
  }
}

/**
 * Middleware to check if user is admin (placeholder for future)
 */
function requireAdmin(req, res, next) {
  // In production, check if user has admin role
  // For now, just pass through
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Token invalid, but continue anyway
      req.user = null;
    }
  }

  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  optionalAuth,
};
