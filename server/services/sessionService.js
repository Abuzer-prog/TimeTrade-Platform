import { Session } from '../models/Session.js';
import { Booking } from '../models/Booking.js';

/**
 * Query marketplace sessions with filters, search, and pagination
 */
export const querySessions = async (queryParams) => {
  const {
    search,
    category,
    status,
    page = 1,
    limit = 12,
    creator,
  } = queryParams;

  const filter = {};

  // Status filtering: default to 'Open' if not specified, or allow 'all'
  if (status && status !== 'all') {
    filter.status = status;
  } else if (!status) {
    filter.status = 'Open';
  }

  // Category filtering
  if (category && category !== 'All') {
    filter.category = category;
  }

  // Creator filtering
  if (creator) {
    filter.creator = creator;
  }

  // Search keyword across title, description, or skillOffered
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { skillOffered: searchRegex },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [total, sessions] = await Promise.all([
    Session.countDocuments(filter),
    Session.find(filter)
      .populate('creator', 'name email department avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  return {
    sessions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNext: pageNum * limitNum < total,
      hasPrev: pageNum > 1,
    },
  };
};

/**
 * Create a new time-exchange session
 */
export const createSession = async (creatorId, sessionData) => {
  const session = await Session.create({
    creator: creatorId,
    title: sessionData.title,
    category: sessionData.category,
    description: sessionData.description,
    skillOffered: sessionData.skillOffered || '',
    durationMinutes: sessionData.durationMinutes || 45,
    timeSlot: sessionData.timeSlot,
    status: 'Open',
  });

  return await session.populate('creator', 'name email department avatarUrl');
};

/**
 * Retrieve session by ID with populated creator details
 */
export const getSessionById = async (sessionId) => {
  const session = await Session.findById(sessionId).populate(
    'creator',
    'name email department avatarUrl'
  );

  if (!session) {
    const error = new Error('Session not found.');
    error.statusCode = 404;
    throw error;
  }

  return session;
};

/**
 * Update an existing session (only creator allowed)
 */
export const updateSession = async (sessionId, userId, updateData) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    const error = new Error('Session not found.');
    error.statusCode = 404;
    throw error;
  }

  if (session.creator.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You can only update your own sessions.');
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = [
    'title',
    'category',
    'description',
    'skillOffered',
    'durationMinutes',
    'timeSlot',
    'status',
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      session[field] = updateData[field];
    }
  });

  await session.save();
  return await session.populate('creator', 'name email department avatarUrl');
};

/**
 * Delete a session and clean up related bookings (only creator allowed)
 */
export const deleteSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId);

  if (!session) {
    const error = new Error('Session not found.');
    error.statusCode = 404;
    throw error;
  }

  if (session.creator.toString() !== userId.toString()) {
    const error = new Error('Forbidden: You can only delete your own sessions.');
    error.statusCode = 403;
    throw error;
  }

  await Booking.deleteMany({ session: sessionId });
  await session.deleteOne();

  return { id: sessionId, message: 'Session deleted successfully' };
};

/**
 * Get all sessions offered by the current user
 */
export const getUserSessions = async (userId) => {
  return await Session.find({ creator: userId })
    .populate('creator', 'name email department avatarUrl')
    .sort({ createdAt: -1 })
    .lean();
};
