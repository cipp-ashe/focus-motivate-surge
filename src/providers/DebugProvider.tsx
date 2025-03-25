
import React from 'react';
import { DebugProvider as DebugContextProvider } from '@/contexts/debug/DebugContext';
import { IS_DEV } from '@/utils/debug/types';

interface DebugProviderProps {
  children: React.ReactNode;
  initialEnabled?: boolean;
}

/**
 * Provider component that wraps the application with debugging capabilities
 */
export function DebugProvider({ 
  children, 
  initialEnabled = IS_DEV 
}: DebugProviderProps) {
  return (
    <DebugContextProvider>
      {children}
    </DebugContextProvider>
  );
}
