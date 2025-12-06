import httpStatus from "http-status";

/**
 * Custom Error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
export const notFound = (req, res, next) => {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    httpStatus.NOT_FOUND
  );
  next(error);
};

/**
 * Global error handler middleware
 * Should be placed at the end of all middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error.message = `Validation Error: ${errors.join(', ')}`;
    error.statusCode = httpStatus.BAD_REQUEST;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for field: ${field}`;
    error.statusCode = httpStatus.CONFLICT;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = httpStatus.BAD_REQUEST;
  }

  // JWT errors (if you implement JWT in future)
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = httpStatus.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = httpStatus.UNAUTHORIZED;
  }

  // Response format
  const response = {
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(error.statusCode).json(response);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Success response helper
 */
export const successResponse = (res, data, message = 'Success', statusCode = httpStatus.OK) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};
