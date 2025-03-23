
// Simple debug utility with minimal functionality

// Constants
export const IS_DEV = process.env.NODE_ENV === 'development';

// Basic logger for development
const logger = {
  debug: (module: string, message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.debug(`[${module}]`, message, ...args);
    }
  },
  
  warn: (module: string, message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.warn(`[${module}]`, message, ...args);
    }
  },
  
  error: (module: string, message: string, ...args: any[]) => {
    console.error(`[${module}]`, message, ...args);
  }
};

// Export the logger
export { logger };

// Main debug module
export const DebugModule = {
  log: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  },
  
  warn: (component: string, message: string, ...args: any[]) => {
    logger.warn(component, message, ...args);
  },
  
  error: (component: string, message: string, ...args: any[]) => {
    logger.error(component, message, ...args);
  }
};

// Also export as default
export default DebugModule;

// Simple placeholder for DebugProvider
export const DebugProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
};
