import express from 'express';
import { body, param } from 'express-validator';
import * as bookingController from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

const requestValidation = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required')
    .isMongoId()
    .withMessage('Invalid Session ID format'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters'),
];

const statusValidation = [
  param('id').isMongoId().withMessage('Invalid request ID'),
  body('status')
    .isIn(['Accepted', 'Rejected'])
    .withMessage('Status must be either Accepted or Rejected'),
];

// All booking operations require authentication
router.use(protect);

router.post('/', requestValidation, handleValidationErrors, bookingController.createBookingRequest);
router.get('/incoming', bookingController.getIncomingRequests);
router.get('/my', bookingController.getMyRequests);
router.patch('/:id/status', statusValidation, handleValidationErrors, bookingController.updateRequestStatus);
router.patch('/:id/cancel', [param('id').isMongoId().withMessage('Invalid request ID'), handleValidationErrors], bookingController.cancelBookingRequest);

export default router;
