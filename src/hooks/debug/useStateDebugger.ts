
import { useEffect, useRef } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

type StateCompareFunction<T> = (prev: T, next: T) => boolean;

/**
 * Hook to debug state changes with before/after values
 * 
 * @param componentName - Name of the component
 * @param stateName - Name of the state being debugged
 * @param state - The state value to debug
 * @param options - Additional options
 */
export function useStateDebugger<T>(
  componentName: string,
  stateName: string,
  state: T,
  options: {
    compareFunction?: StateCompareFunction<T>;
    deepCheck?: boolean;
    showDiff?: boolean;
    logLevel?: 'log' | 'warn' | 'error';
    highlight?: boolean;
  } = {}
) {
  const { isEnabled } = useDebugContext();
  
  const {
    compareFunction,
    deepCheck = true,
    showDiff = true,
    logLevel = 'log',
    highlight = true,
  } = options;
  
  // Reference to previous state value
  const prevStateRef = useRef<T | undefined>(undefined);
  
  // Debug styles
  const styles = {
    componentName: 'font-bold text-blue-500 dark:text-blue-400',
    stateName: 'font-bold text-purple-500 dark:text-purple-400',
    arrow: 'color: gray',
    prevState: 'color: #d97706; font-weight: bold', // amber-600
    nextState: 'color: #059669; font-weight: bold', // emerald-600
    changedProp: 'text-decoration: underline; color: #7c3aed;', // violet-600
    diffSymbol: 'font-bold text-red-500 dark:text-red-400',
  };
  
  useEffect(() => {
    if (!isEnabled) return;
    
    // Check if this is initial render
    const isInitialRender = prevStateRef.current === undefined;
    
    // Skip initial render if we don't want to log it
    if (isInitialRender) {
      prevStateRef.current = state;
      
      // Log initial state
      console.log(
        `%c${componentName} %c${stateName} %cinitial: %c${JSON.stringify(state, null, 2)}`,
        styles.componentName,
        styles.stateName,
        'color: gray',
        'color: #059669' // emerald-600 for initial state
      );
      
      return;
    }
    
    // Determine if state actually changed
    let hasChanged = false;
    
    if (compareFunction) {
      // Use custom compare function
      hasChanged = !compareFunction(prevStateRef.current as T, state);
    } else if (deepCheck) {
      // Deep check (using JSON stringification)
      const prevJson = JSON.stringify(prevStateRef.current);
      const nextJson = JSON.stringify(state);
      hasChanged = prevJson !== nextJson;
    } else {
      // Simple reference check
      hasChanged = prevStateRef.current !== state;
    }
    
    // Only log if state changed
    if (hasChanged) {
      const prevState = prevStateRef.current;
      
      // Prepare console method based on logLevel
      const consoleMethod = console[logLevel];
      
      if (highlight) {
        // Enhanced styled logging
        consoleMethod(
          `%c${componentName} %c${stateName} %cupdated: %c${JSON.stringify(prevState, null, 2)} %c→ %c${JSON.stringify(state, null, 2)}`,
          styles.componentName,
          styles.stateName,
          'color: gray',
          styles.prevState,
          styles.arrow,
          styles.nextState
        );
      } else {
        // Simple logging
        consoleMethod(
          `${componentName} ${stateName} updated:`,
          'Previous:', prevState,
          'Next:', state
        );
      }
      
      // Show detailed diff for objects if requested
      if (showDiff && 
          typeof prevState === 'object' && prevState !== null &&
          typeof state === 'object' && state !== null) {
        try {
          // Find added, removed, and changed properties
          const prevKeys = Object.keys(prevState as object);
          const nextKeys = Object.keys(state as object);
          
          const added = nextKeys.filter(k => !prevKeys.includes(k));
          const removed = prevKeys.filter(k => !nextKeys.includes(k));
          const common = prevKeys.filter(k => nextKeys.includes(k));
          
          const changed = common.filter(k => 
            JSON.stringify((prevState as any)[k]) !== JSON.stringify((state as any)[k])
          );
          
          if (added.length || removed.length || changed.length) {
            console.group('State Diff:');
            
            if (added.length) {
              console.log(
                '%cAdded properties:',
                'color: #059669; font-weight: bold',
                added.reduce((obj, key) => ({ ...obj, [key]: (state as any)[key] }), {})
              );
            }
            
            if (removed.length) {
              console.log(
                '%cRemoved properties:',
                'color: #dc2626; font-weight: bold',
                removed.reduce((obj, key) => ({ ...obj, [key]: (prevState as any)[key] }), {})
              );
            }
            
            if (changed.length) {
              console.log('%cChanged properties:', 'color: #7c3aed; font-weight: bold');
              changed.forEach(key => {
                console.log(
                  `  %c${key}: %c${JSON.stringify((prevState as any)[key])} %c→ %c${JSON.stringify((state as any)[key])}`,
                  styles.changedProp,
                  styles.prevState,
                  styles.arrow,
                  styles.nextState
                );
              });
            }
            
            console.groupEnd();
          }
        } catch (error) {
          console.error('Error generating state diff:', error);
        }
      }
    }
    
    // Update reference to current state for next render
    prevStateRef.current = state;
  }, [
    isEnabled,
    componentName,
    stateName,
    state,
    compareFunction,
    deepCheck,
    showDiff,
    logLevel,
    highlight
  ]);
  
  // Return nothing as this hook is for debugging only
  return null;
}
