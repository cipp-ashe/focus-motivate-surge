
import React from 'react';
import { IS_DEV } from '@/utils/debug';

/**
 * Simplified function to apply debugging to the entire application
 * 
 * @param App - The root application component
 */
export function applyDebugging<P extends object>(
  App: React.ComponentType<P>
): React.ComponentType<P> {
  return App;
}
