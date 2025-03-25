
import { useEffect, useRef } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

/**
 * Hook to track state changes in a component
 * 
 * @param componentName - Name of the component (for logging)
 * @param stateMap - Object containing named state values to track
 * @param options - Debug options
 */
export function useStateDebugger(
  componentName: string,
  stateMap: Record<string, any>,
  options: {
    trackRenders?: boolean;
    logChangesOnly?: boolean;
    enableConsoleGroup?: boolean;
  } = {}
) {
  const { 
    isEnabled, 
    trackRender, 
    trackStateChange 
  } = useDebugContext();
  
  const {
    trackRenders = true,
    logChangesOnly = true,
    enableConsoleGroup = false
  } = options;
  
  // Store the previous state values
  const prevStateRef = useRef<Record<string, any>>({});
  
  // Store render count
  const renderCountRef = useRef(0);
  
  // Track component render
  if (isEnabled && trackRenders) {
    renderCountRef.current += 1;
    trackRender(componentName);
    
    if (enableConsoleGroup) {
      console.groupCollapsed(`${componentName} render #${renderCountRef.current}`);
      console.log('Props & State:', { ...stateMap });
      console.groupEnd();
    }
  }
  
  // Track state changes
  useEffect(() => {
    if (!isEnabled) return;
    
    // Skip first render for change detection
    if (!Object.keys(prevStateRef.current).length) {
      prevStateRef.current = { ...stateMap };
      return;
    }
    
    // Check for changes in each state value
    Object.entries(stateMap).forEach(([name, newValue]) => {
      const prevValue = prevStateRef.current[name];
      const hasChanged = JSON.stringify(prevValue) !== JSON.stringify(newValue);
      
      if (!logChangesOnly || hasChanged) {
        trackStateChange(componentName, name, prevValue, newValue);
      }
    });
    
    // Update previous state reference
    prevStateRef.current = { ...stateMap };
  }, [isEnabled, componentName, trackStateChange, stateMap, logChangesOnly]);
  
  // Return current render count
  return {
    renderCount: renderCountRef.current
  };
}
