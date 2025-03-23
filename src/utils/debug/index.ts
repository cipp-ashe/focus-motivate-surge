
/**
 * Debug Utilities
 * 
 * This module provides utilities for debugging and error handling in the application.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// ============================
// Constants & Types
// ============================

/** Flag to determine if we're in development mode */
export const IS_DEV = process.env.NODE_ENV === 'development';

/** Debug module types for categorizing logs */
export type DebugModule = 
  | 'app' 
  | 'auth'
  | 'ui'
  | 'data'
  | 'timer'
  | 'tasks'
  | 'habits'
  | 'notes'
  | 'examples';

/** Debug level to determine verbosity */
export type DebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

/** Options for the error boundary */
export interface ErrorBoundaryOptions {
  module: DebugModule;
  component: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

/** Debug context state */
interface DebugContextType {
  isEnabled: boolean;
  toggleDebug: () => void;
  debugLevel: DebugLevel;
  setDebugLevel: (level: DebugLevel) => void;
  enabledModules: Set<DebugModule>;
  toggleModule: (module: DebugModule) => void;
  lastError: Error | null;
  setLastError: (error: Error | null) => void;
  logs: Array<{
    timestamp: Date;
    level: DebugLevel;
    module: DebugModule;
    message: string;
    data?: any;
  }>;
  clearLogs: () => void;
}

// Configuration for the debug system
export const DEBUG_CONFIG = {
  enabled: IS_DEV,
  defaultLevel: 'info' as DebugLevel,
  defaultModules: ['app', 'ui', 'data'] as DebugModule[],
  captureConsoleErrors: true,
  captureGlobalErrors: true,
};

// Debug store for event logging
export const debugStore = {
  events: [] as any[],
  addEvent: (event: any) => {
    debugStore.events.push(event);
    // Limit size to prevent memory issues
    if (debugStore.events.length > 1000) {
      debugStore.events.shift();
    }
  },
  getEvents: () => debugStore.events,
  clear: () => {
    debugStore.events = [];
  }
};

// ============================
// Debug Context
// ============================

const DebugContext = createContext<DebugContextType | null>(null);

/** Props for the Debug Provider */
interface DebugProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/** Debug Provider component */
export const DebugProvider: React.FC<DebugProviderProps> = ({ 
  children, 
  enabled = IS_DEV 
}) => {
  // State for debug configuration
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [debugLevel, setDebugLevel] = useState<DebugLevel>('info');
  const [enabledModules, setEnabledModules] = useState<Set<DebugModule>>(
    new Set(['app', 'ui', 'data'])
  );
  const [lastError, setLastError] = useState<Error | null>(null);
  const [logs, setLogs] = useState<DebugContextType['logs']>([]);

  // Toggle debug mode
  const toggleDebug = () => setIsEnabled(prev => !prev);

  // Toggle module logging
  const toggleModule = (module: DebugModule) => {
    setEnabledModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(module)) {
        newSet.delete(module);
      } else {
        newSet.add(module);
      }
      return newSet;
    });
  };

  // Clear all logs
  const clearLogs = () => setLogs([]);

  // Store context value
  const contextValue: DebugContextType = {
    isEnabled,
    toggleDebug,
    debugLevel,
    setDebugLevel,
    enabledModules,
    toggleModule,
    lastError,
    setLastError,
    logs,
    clearLogs
  };

  // Effects to initialize
  useEffect(() => {
    if (isEnabled) {
      console.log('Debug mode enabled');
      // Set up global error handlers
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        setLogs(prev => [...prev, {
          timestamp: new Date(),
          level: 'error',
          module: 'app',
          message
        }]);
        
        originalConsoleError.apply(console, args);
      };
      
      // Cleanup
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, [isEnabled]);

  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
};

/** Hook to use the debug context */
export const useDebugContext = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebugContext must be used within a DebugProvider');
  }
  return context;
};

// ============================
// Debugging Utilities
// ============================

/**
 * Utility to track state changes
 */
export function trackState(
  module: DebugModule,
  component: string,
  stateName: string,
  newValue: any,
  prevValue?: any
): void {
  debugStore.addEvent({
    type: 'state-change',
    module,
    component,
    message: `State '${stateName}' changed`,
    timestamp: Date.now(),
    data: {
      stateName,
      newValue,
      prevValue,
      changed: prevValue !== undefined
    }
  });
}

/**
 * Utility to measure performance
 */
export function measurePerformance<T>(
  module: DebugModule,
  component: string,
  functionName: string,
  fn: () => T
): T {
  const startTime = performance.now();
  let result: T;
  let error: Error | null = null;
  
  try {
    result = fn();
  } catch (e) {
    error = e as Error;
    throw e;
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    debugStore.addEvent({
      type: 'performance',
      module,
      component,
      message: `Function '${functionName}' took ${duration.toFixed(2)}ms`,
      timestamp: Date.now(),
      data: {
        functionName,
        duration,
        error: error ? {
          message: error.message,
          stack: error.stack
        } : null
      }
    });
  }
  
  return result;
}

// ============================
// Error Boundary
// ============================

/**
 * Higher-order component that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: ErrorBoundaryOptions
): React.ComponentType<P> {
  const { module, component, fallback, onError } = options;
  
  // Create wrapped component
  const WrappedComponent = (props: P) => {
    // Default error handler if not provided
    const handleError = onError || ((error, info) => {
      console.error(`Error in ${module}:${component}:`, error);
      console.error('Component stack:', info.componentStack);
    });
    
    // Default fallback UI if not provided
    const fallbackUI = fallback || (
      <div style={{ 
        padding: '1rem', 
        margin: '1rem', 
        border: '1px solid #ff0000',
        borderRadius: '0.25rem',
        background: 'rgba(255, 0, 0, 0.05)'
      }}>
        <h3>Something went wrong</h3>
        <p>An error occurred in the {component} component.</p>
      </div>
    );
    
    return (
      <ErrorBoundary
        fallback={typeof fallbackUI === 'function' 
          ? fallbackUI 
          : () => <>{fallbackUI}</>
        }
        onError={handleError}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  // Set display name for React DevTools
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

// ============================
// Validation Utilities
// ============================

/**
 * Validate data structure
 */
export function validateData<T>(
  data: T,
  module: DebugModule,
  component: string,
  expectedFields: string[] = []
): boolean {
  // Skip validation in production
  if (!IS_DEV) return true;
  
  if (!data) {
    console.warn(`[${module}:${component}] Data validation failed: data is null or undefined`);
    return false;
  }
  
  // Check required fields
  if (expectedFields.length > 0) {
    const missingFields = expectedFields.filter(field => 
      !(field in (data as Record<string, any>))
    );
    
    if (missingFields.length > 0) {
      console.warn(
        `[${module}:${component}] Data validation failed: missing fields: ${missingFields.join(', ')}`,
        data
      );
      return false;
    }
  }
  
  return true;
}

/**
 * Assert a condition is true
 */
export function assertCondition(
  condition: boolean,
  module: DebugModule,
  component: string,
  message: string,
  data?: any
): void {
  // Skip in production
  if (!IS_DEV) return;
  
  if (!condition) {
    console.warn(`[${module}:${component}] Assertion failed: ${message}`, data);
  }
}

// Simple debug hook
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

// Export common utilities
export { DebugContext };
export const logger = console;
