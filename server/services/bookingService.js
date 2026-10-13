import { Booking } from '../models/Booking.js';
import { Session } from '../models/Session.js';

/**
 * Submit a request for a session slot
 */
export const requestSlot = async ({ sessionId, requesterId, message }) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    const error = new Error('Session does not exist.');
    error.statusCode = 404;
    throw error;
  }

  // Prevent users from requesting their own sessions
  if (session.creator.toString() === requesterId.toString()) {
    const error = new Error('You cannot request a slot on your own session offering.');
    error.statusCode = 400;
    throw error;
  }

  if (session.status !== 'Open') {
    const error = new Error(`Cannot request slot. This session is currently ${session.status}.`);
    error.statusCode = 400;
    throw error;
  }

  // Check if a request already exists from this user for this session
  const existingBooking = await Booking.findOne({
    session: sessionId,
    requester: requesterId,
    status: { $in: ['Pending', 'Accepted'] },
  });

  if (existingBooking) {
    const error = new Error(`You already have a ${existingBooking.status.toLowerCase()} request for this session.`);
    error.statusCode = 409;
    throw error;
  }

  const booking = await Booking.create({
    session: sessionId,
    requester: requesterId,
    creator: session.creator,
    message: message || '',
    status: 'Pending',
  });

  return await booking.populate([
    { path: 'session', select: 'title category durationMinutes timeSlot status' },
    { path: 'requester', select: 'name email department avatarUrl' },
    { path: 'creator', select: 'name email department avatarUrl' },
  ]);
};

/**
 * Retrieve incoming slot requests for sessions created by the user
 */
export const getIncomingBookings = async (creatorId) => {
  return await Booking.find({ creator: creatorId })
    .populate('session', 'title category durationMinutes timeSlot status')
    .populate('requester', 'name email department avatarUrl')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Retrieve outgoing slot requests sent by the current user
 */
export const getMySentBookings = async (requesterId) => {
  return await Booking.find({ requester: requesterId })
    .populate('session', 'title category durationMinutes timeSlot status')
    .populate('creator', 'name email department avatarUrl')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Accept or Reject an incoming booking request (creator only)
 */
export const updateBookingStatus = async ({ bookingId, userId, newStatus }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error('Booking request not found.');
    error.statusCode = 404;
    throw error;
  }

  if (booking.creator.toString() !== userId.toString()) {
    const error = new Error('Forbidden: Only the session creator can update request status.');
    error.statusCode = 403;
    throw error;
  }

  if (!['Accepted', 'Rejected'].includes(newStatus)) {
    const error = new Error('Invalid status update. Allowed values are Accepted or Rejected.');
    error.statusCode = 400;
    throw error;
  }

  booking.status = newStatus;
  await booking.save();

  if (newStatus === 'Accepted') {
    // 1. Mark corresponding session as 'Booked'
    await Session.findByIdAndUpdate(booking.session, { status: 'Booked' });

    // 2. Automatically mark any other pending requests for the same session as 'Rejected'
    await Booking.updateMany(
      {
        session: booking.session,
        _id: { $ne: booking._id },
        status: 'Pending',
      },
      {
        status: 'Rejected',
      }
    );
  }

  return await booking.populate([
    { path: 'session', select: 'title category durationMinutes timeSlot status' },
    { path: 'requester', select: 'name email department avatarUrl' },
    { path: 'creator', select: 'name email department avatarUrl' },
  ]);
};

/**
 * Cancel a booking request (by requester or creator)
 */
export const cancelBooking = async ({ bookingId, userId }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    const error = new Error('Booking request not found.');
    error.statusCode = 404;
    throw error;
  }

  const isRequester = booking.requester.toString() === userId.toString();
  const isCreator = booking.creator.toString() === userId.toString();

  if (!isRequester && !isCreator) {
    const error = new Error('Forbidden: You are not authorized to cancel this request.');
    error.statusCode = 403;
    throw error;
  }

  const previousStatus = booking.status;
  booking.status = 'Cancelled';
  await booking.save();

  // If this booking was previously Accepted, free up the session back to 'Open'
  if (previousStatus === 'Accepted') {
    await Session.findByIdAndUpdate(booking.session, { status: 'Open' });
  }

  return await booking.populate([
    { path: 'session', select: 'title category durationMinutes timeSlot status' },
    { path: 'requester', select: 'name email department avatarUrl' },
    { path: 'creator', select: 'name email department avatarUrl' },
  ]);
};
