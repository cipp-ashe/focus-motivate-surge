
import React from 'react';
import { DebugProvider } from '@/providers/DebugProvider';
import { IS_DEV } from './types';

/**
 * Function to apply debugging to the entire application
 * 
 * @param App - The root application component
 */
export function applyDebugging<P extends object>(
  App: React.ComponentType<P>
): React.ComponentType<P> {
  // Simple wrapper component that adds debug capabilities
  const DebuggedApp = (props: P) => {
    return (
      <DebugProvider enabled={IS_DEV}>
        <App {...props} />
      </DebugProvider>
    );
  };
  
  // Set display name for React DevTools
  DebuggedApp.displayName = `DebuggedApp(${App.displayName || App.name || 'App'})`;
  
  return DebuggedApp;
}
