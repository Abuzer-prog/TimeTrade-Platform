import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Input validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 60 })
    .withMessage('Name cannot exceed 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 240 }),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Routes
router.post(
  '/register',
  authLimiter,
  registerValidation,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  handleValidationErrors,
  authController.login
);

router.get('/me', protect, authController.getMe);

router.put('/profile', protect, authController.updateProfile);

export default router;
