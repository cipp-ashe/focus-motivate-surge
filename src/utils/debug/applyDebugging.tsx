
import React from 'react';
import { withErrorBoundary, IS_DEV } from '@/utils/debug';
import { DebugProvider } from '@/providers/DebugProvider';
import { QueryClient } from '@tanstack/react-query';
import { useQueryDebugging } from '@/hooks/debug/useQueryDebugging';

/**
 * Component that wraps the application with debugging providers
 */
export const DebuggingWrapper: React.FC<{
  children: React.ReactNode;
  queryClient?: QueryClient;
}> = ({ children, queryClient }) => {
  // Initialize query debugging if queryClient is provided
  if (queryClient) {
    useQueryDebugging({ queryClient });
  }
  
  return <>{children}</>;
};

/**
 * Function to apply debugging to the entire application
 * 
 * @param App - The root application component
 * @param queryClient - Optional React Query client for query debugging
 */
export function applyDebugging<P extends object>(
  App: React.ComponentType<P>,
  queryClient?: QueryClient
): React.ComponentType<P> {
  // The display name for the wrapped component
  const displayName = App.displayName || App.name || 'App';
  
  // Create error boundary wrapper
  const AppWithErrorBoundary = withErrorBoundary(App, {
    module: 'app',
    component: displayName,
    onError: (error, info) => {
      console.error(`Critical app error:`, error);
      console.error('Component stack:', info.componentStack);
    }
  });
  
  // Create the final app component with debug context
  const DebuggedApp: React.FC<P> = (props) => {
    // In production, we might want to conditionally apply the debug provider
    const enableDebugTools = IS_DEV || localStorage.getItem('debug_enabled') === 'true';
    
    return (
      <DebugProvider enabled={enableDebugTools}>
        <DebuggingWrapper queryClient={queryClient}>
          <AppWithErrorBoundary {...props} />
        </DebuggingWrapper>
      </DebugProvider>
    );
  };
  
  // Set display name for easier identification in React DevTools
  DebuggedApp.displayName = `DebuggingApp(${displayName})`;
  
  return DebuggedApp;
}
