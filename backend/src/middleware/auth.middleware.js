import httpStatus from "http-status";
import { User } from "../models/user.model.js";

/**
 * Authentication middleware - verifies user token and attaches user to request
 * Token can be passed via:
 * - Authorization header: "Bearer <token>"
 * - Query parameter: ?token=<token>
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header or query parameter
    let token = req.query.token;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Access denied. No token provided.",
      });
    }

    // Verify token exists in database
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid or expired token.",
      });
    }

    // Attach user to request object for use in route handlers
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    req.token = token;

    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Authentication error.",
      error: error.message,
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 * Useful for endpoints that have different behavior for authenticated users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.query.token;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (token) {
      const user = await User.findOne({ token });
      if (user) {
        req.user = {
          id: user._id,
          email: user.email,
          name: user.name,
        };
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
