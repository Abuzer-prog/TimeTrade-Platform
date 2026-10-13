import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Sign JWT token for user
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'timetrade_super_secret_jwt_key_replace_in_production_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Register a new student user
 */
export const registerUser = async ({ name, email, password, department, avatarUrl, bio }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Generate an avatar placeholder if none is supplied
  const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`;

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    department: department || 'General Studies',
    avatarUrl: finalAvatar,
    bio: bio || '',
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Authenticate student user and issue token
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    },
    token,
  };
};
