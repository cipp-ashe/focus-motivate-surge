
/**
 * A simple logging utility that can be used throughout the application
 * This allows for standardized logging with additional context
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (context: string, message: string, ...args: any[]) => void;
  info: (context: string, message: string, ...args: any[]) => void;
  warn: (context: string, message: string, ...args: any[]) => void;
  error: (context: string, message: string, ...args: any[]) => void;
}

// Default log level in development is 'debug', in production is 'warn'
const DEFAULT_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

// Log level priorities (higher number = more severe)
const LOG_PRIORITIES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Current log level - can be overridden at runtime
let currentLogLevel: LogLevel = DEFAULT_LOG_LEVEL;

// Format the timestamp for log messages
const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Format a log message with timestamp and context
const formatLogMessage = (level: LogLevel, context: string, message: string): string => {
  return `[${getTimestamp()}] [${level.toUpperCase()}] [${context}] ${message}`;
};

// Check if a log message should be shown based on current log level
const shouldLog = (level: LogLevel): boolean => {
  return LOG_PRIORITIES[level] >= LOG_PRIORITIES[currentLogLevel];
};

// Create the logger object with methods for each log level
export const logger: Logger = {
  debug: (context: string, message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.debug(formatLogMessage('debug', context, message), ...args);
    }
  },
  
  info: (context: string, message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.info(formatLogMessage('info', context, message), ...args);
    }
  },
  
  warn: (context: string, message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(formatLogMessage('warn', context, message), ...args);
    }
  },
  
  error: (context: string, message: string, ...args: any[]) => {
    if (shouldLog('error')) {
      console.error(formatLogMessage('error', context, message), ...args);
    }
  }
};

// Allow changing the log level at runtime
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
  logger.info('LogManager', `Log level set to ${level}`);
};

// Allow getting the current log level
export const getLogLevel = (): LogLevel => {
  return currentLogLevel;
};
