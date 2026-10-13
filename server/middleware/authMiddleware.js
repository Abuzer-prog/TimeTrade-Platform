import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to verify JWT and attach authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Authentication required. No token provided.', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'timetrade_super_secret_jwt_key_replace_in_production_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User associated with this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token has expired. Please sign in again.', 401);
    }
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
};

/**
 * Optional authentication: attaches user if token is present and valid,
 * otherwise continues without rejecting. Useful for personalized public views.
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'timetrade_super_secret_jwt_key_replace_in_production_2026'
    );
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (ignored) {
    // Continue unauthenticated
  }

  next();
};
