
/**
 * Debug utility functions for application-wide instrumentation
 * This file is the central hub for all debugging utilities
 */
import { logger } from '@/utils/logManager';
import React, { createContext, useContext, useState, useCallback } from 'react';

// Environment detection (updated during build process)
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

/**
 * Debug configuration - controls which features are enabled
 */
export const DEBUG_CONFIG = {
  TRACE_DATA_FLOW: IS_DEV || localStorage.getItem('debug_trace_data') === 'true',
  PERFORMANCE_MARKERS: IS_DEV || localStorage.getItem('debug_performance') === 'true',
  STATE_SNAPSHOTS: IS_DEV || localStorage.getItem('debug_state') === 'true',
  RUNTIME_ASSERTIONS: IS_DEV || localStorage.getItem('debug_assertions') === 'true',
  ERROR_REPORTING: true, // Always enabled - errors should never be silently caught
  LOG_LEVEL: parseInt(localStorage.getItem('debug_log_level') || '2', 10)
};

/**
 * The different types of debug events we can track
 */
export type DebugEventType = 
  | 'data-flow' 
  | 'state-change' 
  | 'performance' 
  | 'error' 
  | 'warning'
  | 'assertion'
  | 'validation';

/**
 * Debug module names for categorizing logs
 */
export type DebugModule = 
  | 'tasks' 
  | 'timer' 
  | 'notes' 
  | 'habits' 
  | 'navigation'
  | 'auth'
  | 'storage'
  | 'api'
  | 'events'
  | 'ui'
  | 'forms';

/**
 * Debug event data structure
 */
export interface DebugEvent {
  type: DebugEventType;
  module: DebugModule;
  component?: string;
  message: string;
  timestamp: number;
  data?: any;
  context?: Record<string, any>;
}

/**
 * Debug store to track recent events - this creates a circular buffer
 * that can be inspected in dev tools
 */
class DebugStore {
  private events: DebugEvent[] = [];
  private maxEvents = 1000;

  addEvent(event: DebugEvent) {
    // Add timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Add to circular buffer
    this.events.unshift(event);
    
    // Trim if needed
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    
    return event;
  }

  getEvents() {
    return this.events;
  }

  getEventsByType(type: DebugEventType) {
    return this.events.filter(event => event.type === type);
  }

  getEventsByModule(module: DebugModule) {
    return this.events.filter(event => event.module === module);
  }

  clear() {
    this.events = [];
  }
}

// Create a singleton debug store
export const debugStore = new DebugStore();

// Make debug store available globally in dev mode
if (IS_DEV) {
  // @ts-ignore - intentionally adding to window for debugging
  window.__DEBUG_STORE = debugStore;
}

/**
 * Core debug functions
 */

// Trace data flow through the application
export function traceData(
  module: DebugModule, 
  component: string, 
  message: string, 
  data?: any
) {
  if (!DEBUG_CONFIG.TRACE_DATA_FLOW) return;
  
  const event = debugStore.addEvent({
    type: 'data-flow',
    module,
    component,
    message,
    timestamp: Date.now(),
    data
  });
  
  logger.debug(`${module}:${component}`, `📊 DATA FLOW: ${message}`, data);
  return event;
}

// Measure performance with automatic timers
export function measurePerformance(
  module: DebugModule, 
  component: string, 
  operationName: string, 
  fn: () => any
) {
  if (!DEBUG_CONFIG.PERFORMANCE_MARKERS) {
    return fn();
  }
  
  const startTime = performance.now();
  const timerLabel = `${module}:${component}:${operationName}`;
  
  try {
    console.time(timerLabel);
    const result = fn();
    return result;
  } finally {
    console.timeEnd(timerLabel);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    debugStore.addEvent({
      type: 'performance',
      module,
      component,
      message: `${operationName} - ${duration.toFixed(2)}ms`,
      timestamp: Date.now(),
      data: { duration, operationName }
    });
    
    logger.debug(`${module}:${component}`, `⏱️ PERF: ${operationName} - ${duration.toFixed(2)}ms`);
  }
}

// Track state changes
export function trackState(
  module: DebugModule, 
  component: string, 
  stateName: string, 
  newValue: any, 
  prevValue?: any
) {
  if (!DEBUG_CONFIG.STATE_SNAPSHOTS) return;
  
  const hasChanged = JSON.stringify(newValue) !== JSON.stringify(prevValue);
  
  const event = debugStore.addEvent({
    type: 'state-change',
    module,
    component,
    message: `${stateName} ${hasChanged ? 'changed' : 'unchanged'}`,
    timestamp: Date.now(),
    data: { newValue, prevValue, hasChanged }
  });
  
  if (hasChanged) {
    logger.debug(
      `${module}:${component}`, 
      `🔄 STATE: ${stateName} changed`, 
      { prev: prevValue, new: newValue }
    );
  }
  
  return event;
}

// Validate data with runtime assertions
export function assertCondition(
  condition: boolean, 
  module: DebugModule, 
  component: string, 
  message: string,
  data?: any
) {
  if (!DEBUG_CONFIG.RUNTIME_ASSERTIONS) return;
  
  if (!condition) {
    const event = debugStore.addEvent({
      type: 'assertion',
      module,
      component,
      message: `Assertion failed: ${message}`,
      timestamp: Date.now(),
      data
    });
    
    logger.error(`${module}:${component}`, `❌ ASSERTION FAILED: ${message}`, data);
    
    if (IS_DEV) {
      console.warn(`Assertion failed in ${module}:${component} - ${message}`, data);
    }
    
    return event;
  }
}

// Validate expected data structure is present
export function validateData(
  data: any, 
  module: DebugModule, 
  component: string, 
  expectedFields: string[] = []
) {
  if (!DEBUG_CONFIG.RUNTIME_ASSERTIONS) return true;
  
  const issues = [];
  
  // Check if data exists
  if (data === undefined || data === null) {
    issues.push('Data is null or undefined');
  } else if (expectedFields.length > 0) {
    // Check for expected fields
    for (const field of expectedFields) {
      if (data[field] === undefined) {
        issues.push(`Missing field: ${field}`);
      }
    }
  }
  
  // Log any validation issues
  if (issues.length > 0) {
    const event = debugStore.addEvent({
      type: 'validation',
      module,
      component,
      message: `Data validation issues: ${issues.join(', ')}`,
      timestamp: Date.now(),
      data: { providedData: data, expectedFields, issues }
    });
    
    logger.warn(`${module}:${component}`, `⚠️ VALIDATION: ${issues.join(', ')}`, {
      data,
      expectedFields
    });
    
    return false;
  }
  
  return true;
}

// Export common utilities for use throughout the app
export { logger };

// Create a debug-oriented error boundary HOC
export function withErrorBoundary(Component: React.ComponentType<any>, options?: {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  module?: DebugModule;
  component?: string;
}) {
  return class ErrorBoundary extends React.Component<any, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      // Log the error
      debugStore.addEvent({
        type: 'error',
        module: options?.module || 'ui',
        component: options?.component || Component.displayName || 'UnknownComponent',
        message: `Error boundary caught: ${error.message}`,
        timestamp: Date.now(),
        data: { error, componentStack: info.componentStack }
      });
      
      logger.error(
        `${options?.module || 'ui'}:${options?.component || Component.displayName || 'UnknownComponent'}`,
        `🚨 ERROR BOUNDARY: ${error.message}`,
        { error, componentStack: info.componentStack }
      );
      
      // Call custom error handler if provided
      if (options?.onError) {
        options.onError(error, info);
      }
    }

    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return options?.fallback || (
          <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30">
            <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm">{this.state.error?.message || 'Unknown error'}</p>
            {IS_DEV && this.state.error && (
              <pre className="mt-4 p-2 bg-background/50 rounded text-xs overflow-auto max-h-40">
                {this.state.error.stack}
              </pre>
            )}
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
}

// Create a debug context provider
interface DebugContextType {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  debugStore: typeof debugStore;
  traceData: typeof traceData;
  measurePerformance: typeof measurePerformance;
  trackState: typeof trackState;
  assertCondition: typeof assertCondition;
  validateData: typeof validateData;
}

const DebugContext = createContext<DebugContextType | null>(null);

export const DebugProvider: React.FC<{ children: React.ReactNode; enabled?: boolean }> = ({ 
  children, 
  enabled = true 
}) => {
  const [isDebugMode, setIsDebugMode] = useState(
    enabled && (IS_DEV || localStorage.getItem('debug_mode') === 'true')
  );
  
  const toggleDebugMode = useCallback(() => {
    const newValue = !isDebugMode;
    setIsDebugMode(newValue);
    localStorage.setItem('debug_mode', String(newValue));
    
    // Update config values
    Object.keys(DEBUG_CONFIG).forEach(key => {
      // @ts-ignore - using string keys
      DEBUG_CONFIG[key] = newValue;
    });
    
    logger.info('debug', `Debug mode ${newValue ? 'enabled' : 'disabled'}`);
  }, [isDebugMode]);
  
  const value = {
    isDebugMode,
    toggleDebugMode,
    debugStore,
    traceData,
    measurePerformance,
    trackState,
    assertCondition,
    validateData,
  };
  
  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

// Initialize and export for debugging
if (IS_DEV) {
  console.log('🧪 Debug utilities initialized in development mode');
}
