
/**
 * Performance measurement utilities for debugging
 */
import { DebugModule, IS_DEV } from './types';
import { logDebugEvent } from './logger';

/**
 * Utility to measure performance
 */
export function measurePerformance<T>(
  module: DebugModule,
  component: string,
  functionName: string,
  fn: () => T
): T {
  if (!IS_DEV) return fn();
  
  const startTime = performance.now();
  let result: T;
  let error: Error | null = null;
  
  try {
    result = fn();
  } catch (e) {
    error = e as Error;
    throw e;
  } finally {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    logDebugEvent(
      'performance',
      module,
      component,
      `Function '${functionName}' took ${duration.toFixed(2)}ms`,
      {
        functionName,
        duration,
        error: error ? {
          message: error.message,
          stack: error.stack
        } : null
      }
    );
  }
  
  return result;
}
