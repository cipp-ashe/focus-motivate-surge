
// Define log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Default to INFO in production, DEBUG in development
const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

// Get log level from localStorage or use default
const getLogLevel = (): number => {
  try {
    const storedLevel = localStorage.getItem('log-level');
    if (storedLevel && !isNaN(Number(storedLevel))) {
      return Number(storedLevel);
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return DEFAULT_LOG_LEVEL;
};

// Helper to format log messages
const formatLogMessage = (component: string, message: string, data?: any): string => {
  const formattedMessage = `[${component}] ${message}`;
  if (data) {
    try {
      return `${formattedMessage} ${typeof data === 'string' ? data : JSON.stringify(data)}`;
    } catch (e) {
      return `${formattedMessage} [Object cannot be stringified]`;
    }
  }
  return formattedMessage;
};

// Logger utility
export const logger = {
  debug: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.DEBUG) {
      console.log(formatLogMessage(component, message, data));
    }
  },
  
  info: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.INFO) {
      console.info(formatLogMessage(component, message, data));
    }
  },
  
  warn: (component: string, message: string, data?: any) => {
    if (getLogLevel() >= LOG_LEVELS.WARN) {
      console.warn(formatLogMessage(component, message, data));
    }
  },
  
  error: (component: string, message: string, error?: any) => {
    if (getLogLevel() >= LOG_LEVELS.ERROR) {
      console.error(formatLogMessage(component, message, error));
    }
  },
  
  // Set log level
  setLogLevel: (level: number) => {
    try {
      localStorage.setItem('log-level', level.toString());
    } catch (e) {
      // Ignore localStorage errors
    }
  },
  
  // Get current log level
  getLogLevel
};
