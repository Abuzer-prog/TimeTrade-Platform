import * as sessionService from '../services/sessionService.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @route   GET /api/sessions
 * @desc    Get marketplace sessions with filters, search, and pagination
 * @access  Public
 */
export const getMarketplaceSessions = async (req, res, next) => {
  try {
    const result = await sessionService.querySessions(req.query);
    return successResponse(res, result, 'Sessions fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/sessions/my
 * @desc    Get all sessions offered by the authenticated user
 * @access  Private
 */
export const getMySessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getUserSessions(req.user._id);
    return successResponse(res, { sessions }, 'Your sessions fetched successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session details by ID
 * @access  Public
 */
export const getSessionById = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    return successResponse(res, { session }, 'Session details fetched', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/sessions
 * @desc    Create a new time-exchange session
 * @access  Private
 */
export const createSession = async (req, res, next) => {
  try {
    const session = await sessionService.createSession(req.user._id, req.body);
    return successResponse(res, { session }, 'Session offering created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/sessions/:id
 * @desc    Update an existing session
 * @access  Private
 */
export const updateSession = async (req, res, next) => {
  try {
    const session = await sessionService.updateSession(
      req.params.id,
      req.user._id,
      req.body
    );
    return successResponse(res, { session }, 'Session updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/sessions/:id
 * @desc    Delete a session
 * @access  Private
 */
export const deleteSession = async (req, res, next) => {
  try {
    const result = await sessionService.deleteSession(req.params.id, req.user._id);
    return successResponse(res, result, 'Session deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};
