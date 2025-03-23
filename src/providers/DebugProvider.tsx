
import React from 'react';
import { DebugProvider as DebugToolsProvider } from '@/utils/debug';
import DebugPanel from '@/components/debug/DebugPanel';
import { IS_DEV } from '@/utils/debug';

interface DebugProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/**
 * Provider that adds debug tools to the application
 */
export function DebugProvider({ children, enabled = IS_DEV }: DebugProviderProps) {
  if (!enabled) {
    return <>{children}</>;
  }
  
  return (
    <DebugToolsProvider>
      {children}
      <DebugPanel />
    </DebugToolsProvider>
  );
}
