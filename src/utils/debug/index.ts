
// Re-export the debug module with all the necessary exports
import { logger } from '@/utils/logManager';

// Constants
export const IS_DEV = process.env.NODE_ENV === 'development';

// Debug configuration
export const DEBUG_CONFIG = {
  enableConsoleLogging: true,
  trackStateChanges: true,
  trackDataFlow: true,
  trackPerformance: true,
  enableValidation: true,
  enableExceptionReporting: true
};

// Debug store for events
export const debugStore = {
  events: [] as any[],
  getEvents: () => debugStore.events,
  addEvent: (event: any) => {
    debugStore.events.push({
      ...event,
      timestamp: new Date().toISOString()
    });
    
    // Limit the number of events to prevent memory issues
    if (debugStore.events.length > 1000) {
      debugStore.events = debugStore.events.slice(-1000);
    }
  },
  clear: () => {
    debugStore.events = [];
  }
};

// Debug functions
export const traceData = (module: string, component: string, message: string, data?: any) => {
  debugStore.addEvent({
    type: 'data-flow',
    module,
    component,
    message,
    data
  });
  
  if (DEBUG_CONFIG.enableConsoleLogging) {
    logger.debug(module, `[${component}] ${message}`, data);
  }
};

export const trackState = (module: string, component: string, stateName: string, value: any, prevValue?: any) => {
  debugStore.addEvent({
    type: 'state-change',
    module,
    component,
    message: `State update: ${stateName}`,
    data: { current: value, previous: prevValue }
  });
  
  if (DEBUG_CONFIG.enableConsoleLogging) {
    logger.debug(module, `[${component}] State update: ${stateName}`, { current: value, previous: prevValue });
  }
};

export const measurePerformance = (module: string, component: string, operation: string, duration: number) => {
  debugStore.addEvent({
    type: 'performance',
    module,
    component,
    message: `Performance: ${operation}`,
    data: { duration }
  });
  
  if (DEBUG_CONFIG.enableConsoleLogging && duration > 50) {
    logger.debug(module, `[${component}] Performance: ${operation} (${duration}ms)`);
  }
};

export const validateData = (module: string, component: string, check: string, isValid: boolean, data?: any) => {
  if (!isValid) {
    debugStore.addEvent({
      type: 'validation',
      module,
      component,
      message: `Validation failed: ${check}`,
      data
    });
    
    if (DEBUG_CONFIG.enableConsoleLogging) {
      logger.warn(module, `[${component}] Validation failed: ${check}`, data);
    }
  }
  
  return isValid;
};

export const assertCondition = (
  module: string, 
  component: string, 
  condition: boolean, 
  message: string,
  data?: any
) => {
  if (!condition) {
    debugStore.addEvent({
      type: 'assertion',
      module,
      component,
      message: `Assertion failed: ${message}`,
      data
    });
    
    if (DEBUG_CONFIG.enableConsoleLogging) {
      logger.warn(module, `[${component}] Assertion failed: ${message}`, data);
    }
  }
  
  return condition;
};

// Hook for using debug features
export const useDebug = () => {
  const isDebugMode = localStorage.getItem('debug_enabled') === 'true' || IS_DEV;
  
  const toggleDebugMode = () => {
    const newValue = !isDebugMode;
    localStorage.setItem('debug_enabled', String(newValue));
    window.location.reload();
  };
  
  return {
    isDebugMode,
    toggleDebugMode
  };
};

// Error Boundary Wrapper
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    module: string;
    component: string;
    onError?: (error: Error, info: React.ErrorInfo) => void;
  }
) => {
  const { module, component, onError } = options;
  
  return function WithErrorBoundary(props: P) {
    try {
      return <Component {...props} />;
    } catch (error) {
      if (error instanceof Error) {
        debugStore.addEvent({
          type: 'error',
          module,
          component,
          message: `Error in component: ${error.message}`,
          data: { stack: error.stack }
        });
        
        if (DEBUG_CONFIG.enableConsoleLogging) {
          logger.error(module, `[${component}] Error in component:`, error);
        }
        
        if (onError) {
          onError(error, { componentStack: '' });
        }
      }
      
      return <div>Something went wrong.</div>;
    }
  };
};

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
  },
  
  track: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  },
  
  measure: (component: string, message: string, ...args: any[]) => {
    logger.debug(component, message, ...args);
  }
};

// Also export as default
export default DebugModule;

// Re-export for compatibility with existing imports
export { DebugProvider } from '@/providers/DebugProvider';
