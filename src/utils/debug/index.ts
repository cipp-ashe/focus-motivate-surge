// Core debugging utilities and constants

// Enable debug mode in development and when manually enabled
export const IS_DEV = import.meta.env.DEV || import.meta.env.VITE_DEBUG_ENABLED === 'true';

// Global debug configuration
export const DEBUG_CONFIG = {
  enabled: IS_DEV || localStorage.getItem('debug_enabled') === 'true',
  logLevel: localStorage.getItem('debug_log_level') || 'info',
  TRACE_DATA_FLOW: localStorage.getItem('debug_trace_data') !== 'false',
  TRACE_PERFORMANCE: localStorage.getItem('debug_performance') !== 'false',
  TRACE_STATE: localStorage.getItem('debug_state') !== 'false',
  TRACE_ASSERTIONS: localStorage.getItem('debug_assertions') !== 'false',
};

// Define module types for better type safety
export type DebugModule = 
  | 'api' 
  | 'app' 
  | 'auth' 
  | 'data' 
  | 'events' 
  | 'examples' 
  | 'habits' 
  | 'notes' 
  | 'tasks' 
  | 'timer' 
  | 'ui'
  | 'utils'
  | string;

// Debug event interface
export interface DebugEvent {
  type: 'error' | 'warning' | 'data-flow' | 'performance' | 'state-change' | 'assertion' | 'validation' | string;
  module: DebugModule;
  component: string;
  message: string;
  timestamp: number;
  data?: any;
}

// Simple logger with levels
export const logger = {
  debug: (module: string, message: string, data?: any) => {
    if (DEBUG_CONFIG.logLevel === 'debug') {
      console.debug(`[DEBUG][${module}] ${message}`, data);
    }
  },
  info: (module: string, message: string, data?: any) => {
    if (['debug', 'info'].includes(DEBUG_CONFIG.logLevel)) {
      console.info(`[INFO][${module}] ${message}`, data);
    }
  },
  warn: (module: string, message: string, data?: any) => {
    if (['debug', 'info', 'warn'].includes(DEBUG_CONFIG.logLevel)) {
      console.warn(`[WARN][${module}] ${message}`, data);
    }
  },
  error: (module: string, message: string, data?: any) => {
    console.error(`[ERROR][${module}] ${message}`, data);
  }
};

// Debug store for keeping track of debug events
class DebugStore {
  private events: DebugEvent[] = [];
  private maxEvents = 200;
  private listeners: Set<() => void> = new Set();

  // Add an event to the store
  addEvent(event: DebugEvent): void {
    this.events.unshift(event);
    // Limit the number of events to prevent memory issues
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
    this.notifyListeners();
  }

  // Get all events from the store
  getEvents(): DebugEvent[] {
    return [...this.events];
  }

  // Clear all events from the store
  clear(): void {
    this.events = [];
    this.notifyListeners();
  }

  // Get the current state of the store
  getState(): { events: DebugEvent[] } {
    return { events: this.getEvents() };
  }

  // Update the state of the store
  setState(newState: { events: DebugEvent[] }): void {
    this.events = [...newState.events];
    this.notifyListeners();
  }

  // Subscribe to changes in the store
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Notify all listeners of changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Create a singleton instance of the debug store
export const debugStore = new DebugStore();

// Debug hook for use in components
export const useDebug = () => {
  const isDebugMode = DEBUG_CONFIG.enabled;
  
  const toggleDebugMode = () => {
    const newValue = !DEBUG_CONFIG.enabled;
    localStorage.setItem('debug_enabled', String(newValue));
    
    // Update config
    DEBUG_CONFIG.enabled = newValue;
    
    // Force refresh to apply changes
    window.location.reload();
  };
  
  return {
    isDebugMode,
    toggleDebugMode,
    log: logger.info,
    error: logger.error,
    warn: logger.warn
  };
};

// Trace data flow through the application
export function traceData(
  module: DebugModule,
  component: string,
  eventName: string,
  data?: any
): void {
  if (!DEBUG_CONFIG.TRACE_DATA_FLOW) return;
  
  debugStore.addEvent({
    type: 'data-flow',
    module,
    component,
    message: eventName,
    timestamp: Date.now(),
    data
  });
}

// Measure function performance
export function measurePerformance<T>(
  module: DebugModule,
  component: string,
  functionName: string,
  fn: () => T
): T {
  if (!DEBUG_CONFIG.TRACE_PERFORMANCE) return fn();
  
  const start = performance.now();
  try {
    const result = fn();
    const end = performance.now();
    
    debugStore.addEvent({
      type: 'performance',
      module,
      component,
      message: `Function ${functionName} took ${(end - start).toFixed(2)}ms`,
      timestamp: Date.now(),
      data: {
        function: functionName,
        duration: end - start,
      }
    });
    
    return result;
  } catch (error) {
    const end = performance.now();
    
    debugStore.addEvent({
      type: 'performance',
      module,
      component,
      message: `Function ${functionName} failed after ${(end - start).toFixed(2)}ms`,
      timestamp: Date.now(),
      data: {
        function: functionName,
        duration: end - start,
        error
      }
    });
    
    throw error;
  }
}

// Track state changes
export function trackState(
  module: DebugModule,
  component: string,
  stateName: string,
  currentValue: any,
  previousValue?: any
): void {
  if (!DEBUG_CONFIG.TRACE_STATE) return;
  
  debugStore.addEvent({
    type: 'state-change',
    module,
    component,
    message: `State ${stateName} changed`,
    timestamp: Date.now(),
    data: {
      state: stateName,
      current: currentValue,
      previous: previousValue,
      hasChanged: previousValue !== undefined
    }
  });
}

// Validate data structure
export function validateData<T>(
  data: T,
  module: DebugModule,
  component: string,
  expectedFields: string[] = []
): boolean {
  if (!DEBUG_CONFIG.TRACE_ASSERTIONS) return true;
  
  // Basic validation - check if data exists
  if (data === null || data === undefined) {
    debugStore.addEvent({
      type: 'validation',
      module,
      component,
      message: `Validation failed: data is ${data === null ? 'null' : 'undefined'}`,
      timestamp: Date.now(),
      data: { expectedFields }
    });
    return false;
  }
  
  // Check expected fields
  if (expectedFields.length > 0) {
    const missingFields = expectedFields.filter(
      field => !data || !(field in (data as any))
    );
    
    if (missingFields.length > 0) {
      debugStore.addEvent({
        type: 'validation',
        module,
        component,
        message: `Validation failed: missing fields ${missingFields.join(', ')}`,
        timestamp: Date.now(),
        data: {
          expectedFields,
          missingFields,
          providedData: data
        }
      });
      return false;
    }
  }
  
  return true;
}

// Assert a condition is true
export function assertCondition(
  condition: boolean,
  module: DebugModule,
  component: string,
  message: string,
  data?: any
): void {
  if (!DEBUG_CONFIG.TRACE_ASSERTIONS) return;
  
  if (!condition) {
    debugStore.addEvent({
      type: 'assertion',
      module,
      component,
      message: `Assertion failed: ${message}`,
      timestamp: Date.now(),
      data
    });
  }
}

// Error boundary component to catch React errors
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  module: DebugModule;
  component: string;
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { module, component, onError } = this.props;
    
    logger.error(
      `${module}:${component}`,
      `Error caught in boundary: ${error.message}`,
      { error, componentStack: errorInfo.componentStack }
    );
    
    debugStore.addEvent({
      type: 'error',
      module,
      component,
      message: `Error: ${error.message}`,
      timestamp: Date.now(),
      data: {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        componentStack: errorInfo.componentStack,
      }
    });
    
    if (onError) {
      onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-4 border border-destructive rounded-md bg-destructive/10">
          <h2 className="text-destructive font-medium mb-2">Something went wrong</h2>
          <p className="text-sm">{error?.message}</p>
        </div>
      );
    }

    return children;
  }
}

// High-order component to wrap components with error boundary
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  options: {
    module: DebugModule;
    component: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
): React.ComponentType<P> {
  const { module, component, fallback, onError } = options;
  
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary
        module={module}
        component={component}
        fallback={fallback}
        onError={onError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}

// Debug Provider component for React Context
import { createContext, useContext } from 'react';

interface DebugContextType {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
  trackEvent: (eventName: string, data?: any) => void;
}

const DebugContext = createContext<DebugContextType>({
  isDebugMode: DEBUG_CONFIG.enabled,
  toggleDebugMode: () => {},
  trackEvent: () => {},
});

interface DebugProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ 
  children, 
  enabled = DEBUG_CONFIG.enabled 
}) => {
  const debug = useDebug();
  
  const contextValue: DebugContextType = {
    isDebugMode: debug.isDebugMode,
    toggleDebugMode: debug.toggleDebugMode,
    trackEvent: (eventName: string, data?: any) => {
      logger.debug('debug-provider', eventName, data);
    }
  };
  
  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugContext = () => useContext(DebugContext);
