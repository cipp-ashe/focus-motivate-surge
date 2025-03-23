/**
 * Hook for tracking state changes within components
 */
import { useEffect, useRef } from 'react';
import { trackState, DebugModule } from '@/utils/debug';

interface UseStateTrackingOptions {
  module: DebugModule;
  component: string;
  enabled?: boolean;
  logChangesOnly?: boolean;
}

export function useStateTracking<T>(
  stateName: string,
  stateValue: T,
  options: UseStateTrackingOptions
) {
  const {
    module,
    component,
    enabled = true,
    logChangesOnly = true,
  } = options;

  // Keep track of previous state value
  const prevStateRef = useRef<T | undefined>(undefined);

  // Track changes to the state
  useEffect(() => {
    if (!enabled) return;
    
    const prevValue = prevStateRef.current;
    const hasInitialValue = prevStateRef.current !== undefined;
    
    // Skip logging if we only want to log changes and there are none
    const hasChanged = JSON.stringify(prevValue) !== JSON.stringify(stateValue);
    if (logChangesOnly && hasInitialValue && !hasChanged) {
      prevStateRef.current = stateValue;
      return;
    }
    
    // Track the state change
    trackState(
      module,
      component,
      stateName,
      stateValue,
      hasInitialValue ? prevValue : undefined
    );
    
    // Update previous value
    prevStateRef.current = stateValue;
  }, [stateValue, stateName, module, component, enabled, logChangesOnly]);

  // Return nothing - this hook is used for its side effects
}

/**
 * Track multiple state values together
 */
export function useStateTrackingMany(
  stateValues: Record<string, any>,
  options: UseStateTrackingOptions
) {
  const {
    module,
    component,
    enabled = true,
    logChangesOnly = true,
  } = options;

  // Keep track of previous state values
  const prevStateRef = useRef<Record<string, any>>({});

  // Track changes to the state
  useEffect(() => {
    if (!enabled) return;
    
    // Check each state value
    Object.entries(stateValues).forEach(([stateName, stateValue]) => {
      const prevValue = prevStateRef.current[stateName];
      const hasInitialValue = stateName in prevStateRef.current;
      
      // Skip logging if we only want to log changes and there are none
      const hasChanged = JSON.stringify(prevValue) !== JSON.stringify(stateValue);
      if (logChangesOnly && hasInitialValue && !hasChanged) {
        return;
      }
      
      // Track the state change
      trackState(
        module,
        component,
        stateName,
        stateValue,
        hasInitialValue ? prevValue : undefined
      );
    });
    
    // Update previous values
    prevStateRef.current = { ...stateValues };
  }, [stateValues, module, component, enabled, logChangesOnly]);

  // Return nothing - this hook is used for its side effects
}
