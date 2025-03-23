
// Temporary module to fix debug imports
// This provides a compatible API for the modules that import DebugModule

import { logger } from '@/utils/logManager';

export const DebugModule = {
  log: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  },
  
  warn: (component: string, message: string, ...args: any[]) => {
    logger.warn(component, message, ...args);
  },
  
  error: (component: string, message: string, ...args: any[]) => {
    logger.error(component, message, ...args);
  },
  
  track: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  },
  
  measure: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  }
};

// Export as default and named export to support both import styles
export default DebugModule;
