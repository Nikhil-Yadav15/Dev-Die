import httpStatus from "http-status";

/**
 * Validation middleware factory
 * Creates middleware to validate request body, query, or params
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Validation error",
        errors
      });
    }

    // Replace request data with validated data
    req[source] = value;
    next();
  };
};

/**
 * Simple validation helpers for common cases
 */
export const validateRequired = (fields) => {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of fields) {
      if (!req.body[field]) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Missing required fields",
        missing
      });
    }

    next();
  };
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next();
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Invalid email format"
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: `Invalid ${paramName} format`
      });
    }

    next();
  };
};

/**
 * Sanitize input to prevent injection attacks
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove potential injection patterns
      return obj.replace(/[<>]/g, '').trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};
