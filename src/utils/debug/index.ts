
/**
 * Debug utilities for development and troubleshooting
 */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { logger } from '@/utils/logManager';

// Debug store to maintain debug state across components
class DebugStore {
  private static instance: DebugStore;
  private debugEnabled: boolean = false;
  private debugLevel: 'info' | 'warn' | 'error' | 'verbose' = 'info';
  private callbacks: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): DebugStore {
    if (!DebugStore.instance) {
      DebugStore.instance = new DebugStore();
    }
    return DebugStore.instance;
  }

  public isDebugEnabled(): boolean {
    return this.debugEnabled;
  }

  public getDebugLevel(): 'info' | 'warn' | 'error' | 'verbose' {
    return this.debugLevel;
  }

  public enableDebug(level?: 'info' | 'warn' | 'error' | 'verbose'): void {
    this.debugEnabled = true;
    if (level) {
      this.debugLevel = level;
    }
    this.notifySubscribers();
  }

  public disableDebug(): void {
    this.debugEnabled = false;
    this.notifySubscribers();
  }

  public subscribe(callback: () => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.callbacks.forEach(callback => callback());
  }
}

// Create context for React components
interface DebugContextType {
  debugEnabled: boolean;
  debugLevel: 'info' | 'warn' | 'error' | 'verbose';
  enableDebug: (level?: 'info' | 'warn' | 'error' | 'verbose') => void;
  disableDebug: () => void;
  trace: (componentName: string, message: string) => void;
  performanceStart: (operationName: string) => void;
  performanceEnd: (operationName: string) => void;
  trackStateChange: <T>(componentName: string, stateName: string, prevValue: T, newValue: T) => void;
  validateInput: <T>(componentName: string, inputName: string, value: T, isValid: boolean) => boolean;
  assert: (condition: boolean, message: string) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

// Provider component
interface DebugProviderProps {
  children: ReactNode;
  initialDebugEnabled?: boolean;
  initialDebugLevel?: 'info' | 'warn' | 'error' | 'verbose';
}

export const DebugProvider: React.FC<DebugProviderProps> = ({
  children,
  initialDebugEnabled = false,
  initialDebugLevel = 'info'
}) => {
  const debugStore = DebugStore.getInstance();
  if (initialDebugEnabled) {
    debugStore.enableDebug(initialDebugLevel);
  }

  const [debugEnabled, setDebugEnabled] = useState(debugStore.isDebugEnabled());
  const [debugLevel, setDebugLevel] = useState(debugStore.getDebugLevel());

  // Subscribe to store changes
  React.useEffect(() => {
    const unsubscribe = debugStore.subscribe(() => {
      setDebugEnabled(debugStore.isDebugEnabled());
      setDebugLevel(debugStore.getDebugLevel());
    });
    return unsubscribe;
  }, []);

  const enableDebug = useCallback((level?: 'info' | 'warn' | 'error' | 'verbose') => {
    debugStore.enableDebug(level);
  }, []);

  const disableDebug = useCallback(() => {
    debugStore.disableDebug();
  }, []);

  // Debug utility functions
  const trace = useCallback((componentName: string, message: string) => {
    if (debugEnabled) {
      logger.debug(`[${componentName}] ${message}`);
    }
  }, [debugEnabled]);

  const performanceStart = useCallback((operationName: string) => {
    if (debugEnabled) {
      console.time(`[PERF] ${operationName}`);
    }
  }, [debugEnabled]);

  const performanceEnd = useCallback((operationName: string) => {
    if (debugEnabled) {
      console.timeEnd(`[PERF] ${operationName}`);
    }
  }, [debugEnabled]);

  const trackStateChange = useCallback(<T,>(
    componentName: string,
    stateName: string,
    prevValue: T,
    newValue: T
  ) => {
    if (debugEnabled) {
      console.group(`[STATE] ${componentName}.${stateName} changed`);
      console.log('Previous:', prevValue);
      console.log('Current:', newValue);
      console.groupEnd();
    }
  }, [debugEnabled]);

  const validateInput = useCallback(<T,>(
    componentName: string,
    inputName: string,
    value: T,
    isValid: boolean
  ) => {
    if (debugEnabled && !isValid) {
      console.warn(`[VALIDATION] ${componentName}.${inputName} has invalid value:`, value);
    }
    return isValid;
  }, [debugEnabled]);

  const assert = useCallback((condition: boolean, message: string) => {
    if (debugEnabled && !condition) {
      console.error(`[ASSERTION FAILED] ${message}`);
    }
  }, [debugEnabled]);

  const contextValue: DebugContextType = {
    debugEnabled,
    debugLevel,
    enableDebug,
    disableDebug,
    trace,
    performanceStart,
    performanceEnd,
    trackStateChange,
    validateInput,
    assert
  };

  return (
    <DebugContext.Provider value={contextValue}>
      {children}
    </DebugContext.Provider>
  );
};

// Hook for consuming debug context
export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

// Higher-order component for adding debug boundary
interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryComponent extends React.Component<
  { children: ReactNode; fallback: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('React Error Boundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error: Error | null }>
): React.FC<P> => {
  const WithErrorBoundary: React.FC<P> = (props) => {
    return (
      <ErrorBoundaryComponent
        fallback={<FallbackComponent error={null} />}
      >
        <Component {...props} />
      </ErrorBoundaryComponent>
    );
  };
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  return WithErrorBoundary;
};

// Exports
export { DebugStore };
