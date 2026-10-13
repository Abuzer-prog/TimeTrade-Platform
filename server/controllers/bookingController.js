import * as bookingService from '../services/bookingService.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @route   POST /api/bookings
 * @desc    Request a time slot for a session
 * @access  Private
 */
export const createBookingRequest = async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;
    const booking = await bookingService.requestSlot({
      sessionId,
      requesterId: req.user._id,
      message,
    });
    return successResponse(res, { booking }, 'Slot request sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/incoming
 * @desc    Get all incoming requests for sessions created by user
 * @access  Private
 */
export const getIncomingRequests = async (req, res, next) => {
  try {
    const bookings = await bookingService.getIncomingBookings(req.user._id);
    return successResponse(res, { bookings }, 'Incoming requests retrieved', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/bookings/my
 * @desc    Get all slot requests sent by current user
 * @access  Private
 */
export const getMyRequests = async (req, res, next) => {
  try {
    const bookings = await bookingService.getMySentBookings(req.user._id);
    return successResponse(res, { bookings }, 'Sent requests retrieved', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Accept or Reject a booking request
 * @access  Private
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus({
      bookingId: req.params.id,
      userId: req.user._id,
      newStatus: status,
    });
    return successResponse(
      res,
      { booking },
      `Booking request has been ${status.toLowerCase()}`,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Cancel a booking request
 * @access  Private
 */
export const cancelBookingRequest = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking({
      bookingId: req.params.id,
      userId: req.user._id,
    });
    return successResponse(res, { booking }, 'Booking request cancelled', 200);
  } catch (error) {
    next(error);
  }
};
