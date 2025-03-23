
/**
 * Utility for managing and formatting log messages
 */
export const logger = {
  debug: (section: string, message: string, data?: any) => {
    console.debug(`[${section}] ${message}`, data ? data : '');
  },
  
  info: (section: string, message: string, data?: any) => {
    console.info(`[${section}] ${message}`, data ? data : '');
  },
  
  warn: (section: string, message: string, data?: any) => {
    console.warn(`[${section}] ${message}`, data ? data : '');
  },
  
  error: (section: string, message: string, data?: any) => {
    console.error(`[${section}] ${message}`, data ? data : '');
  },
  
  group: (section: string, message: string) => {
    console.group(`[${section}] ${message}`);
  },
  
  groupEnd: () => {
    console.groupEnd();
  }
};

// Set up global logging configuration
export const configureLogging = (enabled = true, level = 'info') => {
  // Enable or disable console logging globally
  if (!enabled) {
    // Disable console logging
    const noop = () => {};
    console.debug = noop;
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
  }
  
  // Set log level
  if (level === 'error') {
    console.debug = () => {};
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
  } else if (level === 'warn') {
    console.debug = () => {};
    console.log = () => {};
    console.info = () => {};
  } else if (level === 'info') {
    console.debug = () => {};
  }
};
