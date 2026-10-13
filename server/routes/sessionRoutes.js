import express from 'express';
import { body, param } from 'express-validator';
import * as sessionController from '../controllers/sessionController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';
import { SESSION_CATEGORIES, SESSION_STATUSES } from '../models/Session.js';

const router = express.Router();

const sessionCreateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Session title is required')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),
  body('category')
    .trim()
    .isIn(SESSION_CATEGORIES)
    .withMessage(`Category must be one of: ${SESSION_CATEGORIES.join(', ')}`),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('skillOffered')
    .optional()
    .trim()
    .isLength({ max: 200 }),
  body('durationMinutes')
    .optional()
    .isInt({ min: 10, max: 240 })
    .withMessage('Duration must be between 10 and 240 minutes'),
  body('timeSlot')
    .trim()
    .notEmpty()
    .withMessage('Preferred time slot or date is required'),
];

const sessionUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid session ID'),
  body('category')
    .optional()
    .trim()
    .isIn(SESSION_CATEGORIES)
    .withMessage(`Category must be one of: ${SESSION_CATEGORIES.join(', ')}`),
  body('status')
    .optional()
    .isIn(SESSION_STATUSES)
    .withMessage(`Status must be one of: ${SESSION_STATUSES.join(', ')}`),
  body('durationMinutes')
    .optional()
    .isInt({ min: 10, max: 240 })
    .withMessage('Duration must be between 10 and 240 minutes'),
];

// Public routes
router.get('/', optionalAuth, sessionController.getMarketplaceSessions);
router.get('/my', protect, sessionController.getMySessions);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid session ID'), handleValidationErrors], sessionController.getSessionById);

// Protected routes
router.post(
  '/',
  protect,
  sessionCreateValidation,
  handleValidationErrors,
  sessionController.createSession
);

router.put(
  '/:id',
  protect,
  sessionUpdateValidation,
  handleValidationErrors,
  sessionController.updateSession
);

router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid session ID'), handleValidationErrors],
  sessionController.deleteSession
);

export default router;
