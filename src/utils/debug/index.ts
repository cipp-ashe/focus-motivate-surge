
// Debug utility constants and types
import React from 'react';
import { logger } from '@/utils/logManager';

// Debug module types
export type DebugModule = 'app' | 'ui' | 'data' | 'auth' | 'api' | 'state' | 'events';

// Global debug configuration
export const DEBUG_CONFIG = {
  TRACE_DATA_FLOW: process.env.NODE_ENV === 'development',
  MEASURE_PERFORMANCE: process.env.NODE_ENV === 'development',
  TRACK_STATE_CHANGES: process.env.NODE_ENV === 'development',
  VALIDATE_DATA: process.env.NODE_ENV === 'development',
  RECORD_ASSERTIONS: true,
  LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
};

// Flag to check if we're in development mode
export const IS_DEV = process.env.NODE_ENV === 'development';

// Debug store for collecting events
class DebugStore {
  private events: any[] = [];
  private maxEvents = 500;

  addEvent(event: any) {
    this.events.unshift(event);
    
    // Keep the events list at a reasonable size
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }
  }

  getEvents() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }
}

// Create a singleton instance of the debug store
export const debugStore = new DebugStore();

// Debug context for providing debug tools
interface DebugContextType {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}

const DebugContext = React.createContext<DebugContextType>({
  isDebugMode: false,
  toggleDebugMode: () => {},
});

export const DebugProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = React.useState<boolean>(() => {
    return localStorage.getItem('debug_mode') === 'true';
  });

  const toggleDebugMode = React.useCallback(() => {
    setIsDebugMode(prev => {
      const newValue = !prev;
      localStorage.setItem('debug_mode', String(newValue));
      return newValue;
    });
  }, []);

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => React.useContext(DebugContext);

// Utility function to trace data flow
export function traceData(
  module: DebugModule,
  component: string,
  message: string,
  data?: any
) {
  if (!DEBUG_CONFIG.TRACE_DATA_FLOW) return;

  debugStore.addEvent({
    type: 'data-flow',
    module,
    component,
    message,
    timestamp: Date.now(),
    data,
  });

  logger.debug(`${module}:${component}`, message, data);
}

// Utility function to measure performance
export function measurePerformance<T>(
  module: DebugModule,
  component: string,
  operation: string,
  callback: () => T
): T {
  if (!DEBUG_CONFIG.MEASURE_PERFORMANCE) {
    return callback();
  }

  const startTime = performance.now();
  let result: T;
  let error: Error | null = null;

  try {
    result = callback();
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
    throw error;
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;

    debugStore.addEvent({
      type: 'performance',
      module,
      component,
      message: `${operation} took ${duration.toFixed(2)}ms`,
      timestamp: Date.now(),
      data: {
        operation,
        duration,
        hasError: !!error,
        error: error ? error.message : null,
      },
    });

    if (!error) {
      logger.debug(
        `${module}:${component}`,
        `⏱️ ${operation}: ${duration.toFixed(2)}ms`
      );
    } else {
      logger.error(
        `${module}:${component}`,
        `⏱️ ${operation} failed after ${duration.toFixed(2)}ms: ${error.message}`
      );
    }
  }

  return result!;
}

// Utility function to track state changes
export function trackState(
  module: DebugModule,
  component: string,
  stateName: string,
  currentValue: any,
  previousValue?: any
) {
  if (!DEBUG_CONFIG.TRACK_STATE_CHANGES) return;

  debugStore.addEvent({
    type: 'state-change',
    module,
    component,
    message: `State "${stateName}" changed`,
    timestamp: Date.now(),
    data: {
      state: stateName,
      current: currentValue,
      previous: previousValue,
    },
  });

  logger.debug(
    `${module}:${component}`,
    `📊 State "${stateName}" changed:`,
    previousValue !== undefined
      ? { from: previousValue, to: currentValue }
      : { value: currentValue }
  );
}

// Utility function to validate data
export function validateData(
  data: any,
  module: DebugModule,
  component: string,
  expectedFields: string[] = []
): boolean {
  if (!DEBUG_CONFIG.VALIDATE_DATA) return true;

  const missingFields = expectedFields.filter(
    field => data[field] === undefined || data[field] === null
  );

  const isValid = missingFields.length === 0;

  if (!isValid) {
    debugStore.addEvent({
      type: 'validation',
      module,
      component,
      message: `Data validation failed: missing required fields`,
      timestamp: Date.now(),
      data: {
        missingFields,
        data,
      },
    });

    logger.warn(
      `${module}:${component}`,
      `❌ Data validation failed: missing required fields:`,
      missingFields
    );
  }

  return isValid;
}

// Utility function for assertions
export function assertCondition(
  condition: boolean,
  module: DebugModule,
  component: string,
  message: string,
  data?: any
): boolean {
  if (!DEBUG_CONFIG.RECORD_ASSERTIONS) return condition;

  if (!condition) {
    debugStore.addEvent({
      type: 'assertion',
      module,
      component,
      message: `Assertion failed: ${message}`,
      timestamp: Date.now(),
      data,
    });

    logger.warn(
      `${module}:${component}`,
      `⚠️ Assertion failed: ${message}`,
      data
    );
  }

  return condition;
}

// Error boundary HOC for components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    module: DebugModule;
    component: string;
    fallback?: React.ReactNode;
    onError?: (error: Error, info: React.ErrorInfo) => void;
  }
): React.ComponentType<P> {
  const { module, component, fallback, onError } = options;

  class ErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      debugStore.addEvent({
        type: 'error',
        module,
        component,
        message: `Component error: ${error.message}`,
        timestamp: Date.now(),
        data: {
          error: {
            message: error.message,
            stack: error.stack,
          },
          componentStack: errorInfo.componentStack,
        },
      });

      logger.error(
        `${module}:${component}`,
        `🚨 Component error: ${error.message}`,
        {
          error,
          componentStack: errorInfo.componentStack,
        }
      );

      if (onError) {
        onError(error, errorInfo);
      }
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return fallback;
        }
        return (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded">
            <h3 className="text-lg font-medium">Something went wrong</h3>
            <p className="mt-1">
              {this.state.error ? this.state.error.message : 'Unknown error'}
            </p>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  }

  ErrorBoundary.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return ErrorBoundary as any;
}

// Export a utility function to create a debug logger
export function createDebugLogger(namespace: string) {
  return {
    log: (...args: any[]) => logger.debug(namespace, ...args),
    warn: (...args: any[]) => logger.warn(namespace, ...args),
    error: (...args: any[]) => logger.error(namespace, ...args),
    info: (...args: any[]) => logger.info(namespace, ...args),
  };
}
