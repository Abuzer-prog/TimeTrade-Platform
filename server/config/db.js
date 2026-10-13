import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB with retry logic and graceful connection lifecycle handlers
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/timetrade';

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes in development
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Attempting reconnection...');
    });

    // Graceful process termination handling
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to application termination (SIGINT)');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to application termination (SIGTERM)');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error(`Initial MongoDB connection failed: ${error.message}`);
    // In production we exit; in dev, server can run or alert the user
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
