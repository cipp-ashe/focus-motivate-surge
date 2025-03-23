
/**
 * Hook for validating data integrity and runtime assertions
 */
import { useCallback } from 'react';
import { validateData, assertCondition, DebugModule } from '@/utils/debug';

interface UseValidationOptions {
  module: DebugModule;
  component: string;
  enabled?: boolean;
  strictMode?: boolean;
}

export function useValidation(options: UseValidationOptions) {
  const {
    module,
    component,
    enabled = true,
    strictMode = false,
  } = options;

  /**
   * Validate data structure
   */
  const validate = useCallback(
    <T>(
      data: T,
      expectedFields: (keyof T)[] = [],
      customMessage?: string
    ): boolean => {
      if (!enabled) return true;
      
      return validateData(
        data,
        module,
        component,
        expectedFields as string[]
      );
    },
    [enabled, module, component]
  );

  /**
   * Assert a condition is true
   */
  const assert = useCallback(
    (
      condition: boolean,
      message: string,
      data?: any
    ): void => {
      if (!enabled) return;
      
      if (strictMode && !condition) {
        throw new Error(`Assertion failed in ${module}:${component} - ${message}`);
      }
      
      assertCondition(condition, module, component, message, data);
    },
    [enabled, strictMode, module, component]
  );

  /**
   * Check for null/undefined/empty values
   */
  const checkNullOrUndefined = useCallback(
    <T>(
      value: T | null | undefined,
      name: string
    ): value is T => {
      if (!enabled) return true as any;
      
      const isValid = value !== null && value !== undefined;
      
      if (!isValid) {
        assertCondition(
          false,
          module,
          component,
          `${name} is ${value === null ? 'null' : 'undefined'}`,
          { name, value }
        );
        
        if (strictMode) {
          throw new Error(
            `Validation error in ${module}:${component} - ${name} is ${
              value === null ? 'null' : 'undefined'
            }`
          );
        }
      }
      
      return isValid;
    },
    [enabled, strictMode, module, component]
  );

  /**
   * Check for empty arrays or objects
   */
  const checkEmpty = useCallback(
    <T extends any[] | Record<string, any> | string>(
      value: T,
      name: string
    ): boolean => {
      if (!enabled) return true;
      
      let isEmpty = false;
      
      if (Array.isArray(value)) {
        isEmpty = value.length === 0;
      } else if (typeof value === 'object' && value !== null) {
        isEmpty = Object.keys(value).length === 0;
      } else if (typeof value === 'string') {
        isEmpty = value.trim() === '';
      }
      
      if (isEmpty) {
        assertCondition(
          false,
          module,
          component,
          `${name} is empty`,
          { name, value }
        );
        
        if (strictMode) {
          throw new Error(
            `Validation error in ${module}:${component} - ${name} is empty`
          );
        }
      }
      
      return !isEmpty;
    },
    [enabled, strictMode, module, component]
  );

  return {
    validate,
    assert,
    checkNullOrUndefined,
    checkEmpty,
  };
}
