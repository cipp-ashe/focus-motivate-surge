
import React from 'react';
import { IS_DEV } from '@/utils/debug';

interface DebugProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/**
 * Simplified provider that adds debug tools to the application
 */
export function DebugProvider({ children }: DebugProviderProps) {
  return <>{children}</>;
}
