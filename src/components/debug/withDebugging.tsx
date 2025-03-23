
import React from 'react';
import { withErrorBoundary, IS_DEV, DebugProvider as DebugContextProvider } from '@/utils/debug';

/**
 * Higher-order component that adds debugging capabilities to a component
 * 
 * @param Component - The component to enhance with debugging
 * @param options - Configuration options for debugging
 */
export function withDebugging<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    module?: string;
    enableErrorBoundary?: boolean;
  }
) {
  const { 
    module = 'ui',
    enableErrorBoundary = true
  } = options || {};
  
  // The display name for the wrapped component
  const displayName = Component.displayName || Component.name || 'Component';
  
  // First wrap with error boundary if enabled
  let WrappedComponent: React.ComponentType<P> = Component;
  
  if (enableErrorBoundary) {
    WrappedComponent = withErrorBoundary(Component, {
      module: module as any,
      component: displayName,
      onError: (error, info) => {
        console.error(`Error in ${displayName}:`, error);
        console.error('Component stack:', info.componentStack);
      }
    });
  }
  
  // Then create the final component with debug context
  const DebuggedComponent: React.FC<P> = (props) => {
    // In production, we might want to conditionally apply the debug provider
    const enableDebugTools = IS_DEV || localStorage.getItem('debug_enabled') === 'true';
    
    if (!enableDebugTools) {
      return <WrappedComponent {...props} />;
    }
    
    return (
      <DebugContextProvider enabled={enableDebugTools}>
        <WrappedComponent {...props} />
      </DebugContextProvider>
    );
  };
  
  // Set display name for easier identification in React DevTools
  DebuggedComponent.displayName = `withDebugging(${displayName})`;
  
  return DebuggedComponent;
}

/**
 * Creates a component wrapped with debugging capabilities
 */
export function createDebugComponent<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    module?: string;
    enableErrorBoundary?: boolean;
  }
) {
  return withDebugging(Component, options);
}
