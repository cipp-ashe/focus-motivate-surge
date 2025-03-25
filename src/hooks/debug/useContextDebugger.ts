
import { useEffect, useRef } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

/**
 * Hook to track changes in a context provider's value
 * 
 * @param providerName - Name of the context provider
 * @param contextValue - Current context value
 * @param options - Debug options
 */
export function useContextDebugger(
  providerName: string,
  contextValue: Record<string, any>,
  options: {
    logChangesOnly?: boolean;
    exclude?: string[];
  } = {}
) {
  const { 
    isEnabled, 
    trackContextChange 
  } = useDebugContext();
  
  const {
    logChangesOnly = true,
    exclude = []
  } = options;
  
  // Store the previous context value
  const prevContextRef = useRef<Record<string, any>>({});
  
  // Track context changes
  useEffect(() => {
    if (!isEnabled) return;
    
    // Skip first render for change detection
    if (!Object.keys(prevContextRef.current).length) {
      prevContextRef.current = { ...contextValue };
      return;
    }
    
    // Find changes between previous and current context values
    const changes: Record<string, { prev: any; current: any }> = {};
    let hasChanges = false;
    
    Object.keys(contextValue).forEach(key => {
      // Skip excluded keys
      if (exclude.includes(key)) return;
      
      const prevValue = prevContextRef.current[key];
      const currentValue = contextValue[key];
      
      // Check for changes (stringify for deep comparison)
      const hasChanged = JSON.stringify(prevValue) !== JSON.stringify(currentValue);
      
      if (hasChanged) {
        changes[key] = {
          prev: prevValue,
          current: currentValue
        };
        hasChanges = true;
      }
    });
    
    // Track changes if any were found (or if not only logging changes)
    if (hasChanges || !logChangesOnly) {
      trackContextChange(providerName, changes);
    }
    
    // Update previous context reference
    prevContextRef.current = { ...contextValue };
  }, [isEnabled, providerName, contextValue, trackContextChange, logChangesOnly, exclude]);
  
  return {
    lastChanges: prevContextRef.current
  };
}
