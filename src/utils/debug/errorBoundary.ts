
/**
 * Error boundary utilities for debugging
 */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DebugModule, IS_DEV } from './types';
import { logDebugEvent } from './logger';

/** Options for the error boundary */
export interface ErrorBoundaryOptions {
  module: DebugModule;
  component: string;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

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
      
      logDebugEvent(
        'error',
        module,
        component,
        `Component error: ${error.message}`,
        { error, componentStack: info.componentStack }
      );
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
