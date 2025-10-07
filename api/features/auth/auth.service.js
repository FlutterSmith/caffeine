/**
 * Authentication Service
 * Business logic for user authentication
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// In-memory user storage (use database in production)
const users = new Map();

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user (without password)
   */
  async register(userData) {
    const { firstName, lastName, email, password, phone } = userData;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }

    // Check if user already exists
    if (users.has(email)) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.set(email, user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Authenticate user and generate JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Token and user data
   */
  async login(email, password) {
    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    );

    // Return token and user data
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Object|null} User data (without password)
   */
  getUserByEmail(email) {
    const user = users.get(email);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token data
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      );
      return decoded;
    } catch (error) {
      const err = new Error("Invalid token");
      err.statusCode = 401;
      throw err;
    }
  }

  /**
   * Get all users (admin only - for testing)
   * @returns {Array} List of users without passwords
   */
  getAllUsers() {
    return Array.from(users.values()).map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = new AuthService();
