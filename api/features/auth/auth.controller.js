/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */

const authService = require("./auth.service");

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error("Registration error:", error);

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Registration failed",
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { token, user } = await authService.login(
        req.body.email,
        req.body.password,
      );

      res.json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error) {
      console.error("Login error:", error);

      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Login failed",
      });
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(req, res) {
    try {
      const user = authService.getUserByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      // In a real app with refresh tokens, you'd invalidate them here
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  }
}

module.exports = new AuthController();
