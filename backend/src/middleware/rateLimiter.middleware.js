import rateLimit from "express-rate-limit";
import httpStatus from "http-status";

/**
 * General API rate limiter
 * Limits requests to prevent abuse
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again later.",
    statusCode: httpStatus.TOO_MANY_REQUESTS,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks on login/register
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    message: "Too many authentication attempts, please try again after 15 minutes.",
    statusCode: httpStatus.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for notification/email routes
 * Prevents spam
 */
export const notificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Max 20 notifications per 5 minutes
  message: {
    message: "Too many notification requests, please slow down.",
    statusCode: httpStatus.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for create/update operations
 * Prevents spam creation
 */
export const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 creates per minute
  message: {
    message: "Too many create/update requests, please slow down.",
    statusCode: httpStatus.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for sensitive operations
 * Like password changes, account deletion
 */
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 attempts per hour
  message: {
    message: "Too many attempts for this sensitive operation, please try again later.",
    statusCode: httpStatus.TOO_MANY_REQUESTS,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
