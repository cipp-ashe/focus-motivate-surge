
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
  TRACE_DATA_FLOW: true,
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

// Function implementations for the debug hooks
export const traceData = (component?: string, event?: string, data?: any, meta?: any) => {
  if (IS_DEV && DEBUG_CONFIG.TRACE_DATA_FLOW) {
    debugLog(component || 'unknown', `TRACE: ${event || 'event'}`, { data, meta });
  }
  return data; // Return data for chaining
};

export const measurePerformance = (name: string, fn: Function) => {
  if (!IS_DEV || !DEBUG_CONFIG.enablePerformance) return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  debugLog('Performance', `${name}: ${end - start}ms`);
  return result;
};

export const trackState = (component?: string, name?: string, value?: any, prev?: any, meta?: any) => {
  if (IS_DEV && DEBUG_CONFIG.enableStateTracking) {
    debugLog(component || 'unknown', `STATE: ${name || 'state'} changed`, { 
      prev, 
      current: value, 
      meta 
    });
  }
};

export const validateData = (schema: any, data: any, component?: string, errorMessage?: string) => {
  if (!IS_DEV || !DEBUG_CONFIG.enableValidation) return true;
  
  try {
    if (schema && typeof schema.parse === 'function') {
      schema.parse(data);
      return true;
    }
    return true;
  } catch (error) {
    debugError(component || 'Validation', errorMessage || 'Validation failed', { error, data });
    return false;
  }
};

export const assertCondition = (
  condition: boolean, 
  component?: string, 
  message?: string, 
  data?: any, 
  level: 'error' | 'warn' | 'log' = 'error'
) => {
  if (IS_DEV && !condition) {
    if (level === 'error') {
      debugError(component || 'Assertion', message || 'Assertion failed', data);
    } else if (level === 'warn') {
      debugWarn(component || 'Assertion', message || 'Assertion failed', data);
    } else {
      debugLog(component || 'Assertion', message || 'Assertion failed', data);
    }
  }
};

// Logger with all methods
export const logger = { 
  log: debugLog, 
  warn: debugWarn, 
  error: debugError,
  info: (component: string, message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[${component}] ${message}`, data || '');
    }
  }
};

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

// Stub implementation for withErrorBoundary
export const withErrorBoundary = (Component: any, options: any) => Component;

// Mock component for DebugProvider
export const DebugProvider = ({ children }: { children: React.ReactNode }) => children;

// Default export with all utilities for easier access
const DebugModule = {
  debugLog,
  debugWarn,
  debugError,
  IS_DEV,
  DEBUG_CONFIG,
  debugStore,
  withErrorBoundary,
  useDebug,
  traceData,
  measurePerformance,
  trackState,
  validateData,
  assertCondition,
  logger,
  DebugProvider
};

export default DebugModule;
