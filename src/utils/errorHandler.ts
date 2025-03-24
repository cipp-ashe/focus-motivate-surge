
/**
 * Central error handling utility for the application
 */

// Log levels for different environments
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'production' 
  ? LOG_LEVELS.INFO 
  : LOG_LEVELS.DEBUG;

// Format error stack traces for better readability
const formatErrorStack = (error: Error): string => {
  if (!error.stack) return error.message;
  
  const stackLines = error.stack.split('\n');
  const formattedStack = stackLines
    .slice(0, 10) // Limit stack trace to first 10 lines
    .map(line => `  ${line.trim()}`)
    .join('\n');
    
  return formattedStack;
};

// Log application errors with context
export const logError = (
  component: string, 
  message: string, 
  error?: unknown, 
  context?: Record<string, unknown>
): void => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  console.group(`🔴 Error in ${component}`);
  console.error(message);
  
  if (error) {
    console.error('Error details:', errorObj);
    console.error('Stack trace:');
    console.error(formatErrorStack(errorObj));
  }
  
  if (context) {
    console.error('Context:', context);
  }
  
  console.groupEnd();
  
  // Show toast for visible errors in development
  if (process.env.NODE_ENV !== 'production') {
    try {
      const toastModule = require('sonner');
      if (toastModule && toastModule.toast) {
        toastModule.toast.error(`Error: ${message}`, {
          description: errorObj.message,
          duration: 5000,
        });
      }
    } catch (e) {
      // Toast module not available, just continue
      console.log('Toast module not available for error notification');
    }
  }
};

// Setup global error handlers
export const setupGlobalErrorHandlers = (): void => {
  if (typeof window === 'undefined') return;
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logError(
      'Global', 
      'Uncaught error', 
      event.error, 
      { message: event.message, filename: event.filename, lineno: event.lineno }
    );
    
    // Log to console
    console.error('Uncaught error:', event.error);
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      'Global', 
      'Unhandled promise rejection', 
      event.reason, 
      { promise: event.promise }
    );
    
    // Log to console
    console.error('Unhandled promise rejection:', event.reason);
  });
  
  console.log('Global error handlers set up successfully');
};

export default {
  LOG_LEVELS,
  logError,
  setupGlobalErrorHandlers
};
