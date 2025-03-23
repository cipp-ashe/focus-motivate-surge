
/**
 * Logger utilities for debugging
 */
import { useState } from 'react';
import { DebugModule, IS_DEV, debugStore } from './types';

// Export common utilities
export const logger = console;

/**
 * Simple hook for debug functionality
 */
export const useDebug = () => {
  const [isDebugMode, setIsDebugMode] = useState(() => 
    localStorage.getItem('debug_enabled') === 'true' || IS_DEV
  );
  
  const toggleDebugMode = () => {
    const newValue = !isDebugMode;
    setIsDebugMode(newValue);
    localStorage.setItem('debug_enabled', String(newValue));
    console.log(`Debug mode ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  return {
    isDebugMode,
    toggleDebugMode,
    logger: {
      log: (module: string, message: string, data?: any) => {
        if (isDebugMode) {
          console.log(`[${module}] ${message}`, data);
        }
      },
      warn: (module: string, message: string, data?: any) => {
        if (isDebugMode) {
          console.warn(`[${module}] ${message}`, data);
        }
      },
      error: (module: string, message: string, data?: any) => {
        console.error(`[${module}] ${message}`, data);
      }
    }
  };
};

/**
 * Utility to log events to the debug store
 */
export function logDebugEvent(
  type: string,
  module: DebugModule, 
  component: string, 
  message: string, 
  data?: any
): void {
  if (!IS_DEV) return;
  
  debugStore.addEvent({
    type,
    module,
    component,
    message,
    timestamp: Date.now(),
    data
  });
}
