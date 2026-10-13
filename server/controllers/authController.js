import * as authService from '../services/authService.js';
import { User } from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student account
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, department, avatarUrl, bio } = req.body;
    const result = await authService.registerUser({
      name,
      email,
      password,
      department,
      avatarUrl,
      bio,
    });
    return successResponse(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return successResponse(res, result, 'Login successful', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user }, 'User profile retrieved', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update student profile details
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, department, bio, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (department !== undefined) user.department = department;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          createdAt: user.createdAt,
        },
      },
      'Profile updated successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
