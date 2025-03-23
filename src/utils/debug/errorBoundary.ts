
/**
 * Error boundary utilities for React components
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DebugModule, debugStore } from './types';
import { logDebugEvent } from './logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  module: DebugModule;
  component: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and handle errors in React components
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { module, component, onError } = this.props;
    
    // Log the error to the debug store
    logDebugEvent(
      'error',
      module,
      component,
      `Error in ${component}: ${error.message}`,
      { error: error.toString(), componentStack: errorInfo.componentStack }
    );
    
    // Call the onError callback if provided
    if (onError) {
      onError(error, errorInfo);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${component}:`, error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-500 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium">Something went wrong</h3>
          <p className="mt-1 text-sm">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC that wraps a component with an error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    module: DebugModule;
    component: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      module={options.module}
      component={options.component}
      fallback={options.fallback}
      onError={options.onError}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
}

export default ErrorBoundary;
