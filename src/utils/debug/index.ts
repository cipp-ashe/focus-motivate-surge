
// This file contains simplified debug utilities

/**
 * Debug utilities for development
 */
export const debugLog = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${component}] ${message}`, data || '');
  }
};

export const debugWarn = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[${component}] ${message}`, data || '');
  }
};

export const debugError = (component: string, message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${component}] ${message}`, data || '');
  }
};

// Debug constants
export const IS_DEV = process.env.NODE_ENV !== 'production';
export const DEBUG_CONFIG = {
  enableDataFlow: true,
  enablePerformance: true,
  enableStateTracking: true,
  enableValidation: true,
  enableErrorBoundary: true,
};

// Mock debug store for storing events
export const debugStore = {
  events: [] as any[],
  addEvent: (event: any) => {
    debugStore.events.push(event);
    if (debugStore.events.length > 100) {
      debugStore.events.shift();
    }
  },
  getEvents: () => debugStore.events,
  clear: () => {
    debugStore.events = [];
  }
};

// Mock functions to make TypeScript happy
export const withErrorBoundary = (Component: any, options: any) => Component;
export const traceData = () => {};
export const measurePerformance = () => {};
export const trackState = () => {};
export const validateData = () => {};
export const assertCondition = () => {};
export const logger = { log: debugLog, warn: debugWarn, error: debugError };
export const DebugProvider = ({ children }: { children: React.ReactNode }) => children;

// Export a useDebug hook
export const useDebug = () => {
  return {
    isDebugMode: () => IS_DEV || localStorage.getItem('debug-mode') === 'true',
    toggleDebugMode: () => {
      const current = localStorage.getItem('debug-mode') === 'true';
      localStorage.setItem('debug-mode', (!current).toString());
      return !current;
    }
  };
};

// Export as default for compatibility
export default {
  debugLog,
  debugWarn,
  debugError,
  IS_DEV,
  DEBUG_CONFIG,
  debugStore,
  withErrorBoundary,
  useDebug,
  // Add other exports
};
