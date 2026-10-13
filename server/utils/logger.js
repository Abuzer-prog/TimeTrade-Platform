/**
 * Production-ready standardized logging utility
 */
const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, ...args) => {
    console.log(`[${getTimestamp()}] \x1b[34m[INFO]\x1b[0m ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[${getTimestamp()}] \x1b[33m[WARN]\x1b[0m ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[${getTimestamp()}] \x1b[31m[ERROR]\x1b[0m ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${getTimestamp()}] \x1b[35m[DEBUG]\x1b[0m ${message}`, ...args);
    }
  },
};
