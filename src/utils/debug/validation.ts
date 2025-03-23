
/**
 * Validation utilities for debugging
 */
import { DebugModule, IS_DEV } from './types';
import { logDebugEvent } from './logger';

/**
 * Simplified validation utility
 */
export function validateData<T>(
  data: T,
  module: DebugModule,
  component: string,
  expectedFields: string[] = []
): boolean {
  // Skip validation in production
  if (!IS_DEV) return true;
  
  if (!data) {
    console.warn(`[${module}:${component}] Data validation failed: data is null or undefined`);
    return false;
  }
  
  // Check required fields
  if (expectedFields.length > 0) {
    const missingFields = expectedFields.filter(field => 
      !(field in (data as Record<string, any>))
    );
    
    if (missingFields.length > 0) {
      console.warn(
        `[${module}:${component}] Data validation failed: missing fields: ${missingFields.join(', ')}`,
        data
      );
      return false;
    }
  }
  
  return true;
}

/**
 * Simplified assertion utility
 */
export function assertCondition(
  condition: boolean,
  module: DebugModule,
  component: string,
  message: string,
  data?: any
): void {
  // Skip in production
  if (!IS_DEV) return;
  
  if (!condition) {
    console.warn(`[${module}:${component}] Assertion failed: ${message}`, data);
    
    logDebugEvent(
      'assertion',
      module,
      component,
      `Assertion failed: ${message}`,
      data
    );
  }
}
