import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Middleware to check express-validator validation results
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return errorResponse(
      res,
      'Invalid input parameters provided',
      400,
      formattedErrors
    );
  }
  next();
};
