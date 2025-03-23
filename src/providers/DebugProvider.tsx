
import React from 'react';
import { DebugProvider as DebugContextProvider, IS_DEV } from '@/utils/debug';

interface DebugProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/**
 * Provider that adds debug tools to the application
 */
export function DebugProvider({ children, enabled = IS_DEV }: DebugProviderProps) {
  return (
    <DebugContextProvider enabled={enabled}>
      {children}
    </DebugContextProvider>
  );
}
