
import { useEffect, useRef } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

/**
 * Hook to debug useEffect dependencies
 * 
 * @param effectHook - The effect callback
 * @param dependencies - The effect dependencies
 * @param options - Debug options
 */
export function useEffectDebugger(
  effectHook: React.EffectCallback,
  dependencies: any[],
  options: {
    componentName: string;
    effectName?: string;
    trackTiming?: boolean;
  }
) {
  const { isEnabled } = useDebugContext();
  const { 
    componentName,
    effectName = 'unnamed effect',
    trackTiming = true
  } = options;
  
  // Store previous dependencies
  const prevDepsRef = useRef<any[]>([]);
  
  useEffect(() => {
    if (!isEnabled) {
      // Just run the effect normally when debugging is disabled
      return effectHook();
    }
    
    const changes: { index: number; from: any; to: any }[] = [];
    const startTime = performance.now();
    
    // Find which dependencies changed
    if (prevDepsRef.current.length) {
      dependencies.forEach((dep, index) => {
        if (JSON.stringify(dep) !== JSON.stringify(prevDepsRef.current[index])) {
          changes.push({
            index,
            from: prevDepsRef.current[index],
            to: dep
          });
        }
      });
      
      if (changes.length) {
        console.group(`🔍 ${componentName} - ${effectName} effect triggered`);
        console.log('Changed dependencies:', changes);
        console.groupEnd();
      }
    }
    
    // Run the actual effect
    const cleanupFn = effectHook();
    
    if (trackTiming) {
      const effectDuration = performance.now() - startTime;
      if (effectDuration > 5) {
        console.warn(`⏱️ Slow effect ${componentName} - ${effectName}: ${effectDuration.toFixed(2)}ms`);
      }
    }
    
    // Update previous dependencies
    prevDepsRef.current = [...dependencies];
    
    // Return the original cleanup function
    return cleanupFn;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
}
