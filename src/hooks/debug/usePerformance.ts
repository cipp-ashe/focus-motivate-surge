
/**
 * Hook for measuring component and function performance
 */
import { useRef, useEffect, useCallback } from 'react';
import { measurePerformance, DebugModule } from '@/utils/debug';

interface UsePerformanceOptions {
  module: DebugModule;
  component: string;
  enabled?: boolean;
  trackRenders?: boolean;
  trackEffects?: boolean;
}

export function usePerformance(options: UsePerformanceOptions) {
  const {
    module,
    component,
    enabled = true,
    trackRenders = true,
    trackEffects = false,
  } = options;

  // Track render times
  const renderStartTimeRef = useRef(0);
  const effectStartTimeRef = useRef<Record<string, number>>({});
  const renderCountRef = useRef(0);
  
  // Set render start time
  if (enabled && trackRenders && renderStartTimeRef.current === 0) {
    renderStartTimeRef.current = performance.now();
  }

  // Measure render duration after component renders
  useEffect(() => {
    if (!enabled || !trackRenders) return;
    
    renderCountRef.current += 1;
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTimeRef.current;
    
    console.log(`[${module}:${component}] Render #${renderCountRef.current} duration: ${renderDuration.toFixed(2)}ms`);
    
    // Reset for next render
    renderStartTimeRef.current = 0;
  });

  // Create a measurable effect hook
  const measureEffect = useCallback(
    (effectName: string, effectFn: () => void | (() => void)) => {
      if (!enabled || !trackEffects) {
        return effectFn;
      }
      
      return () => {
        // Start measuring
        effectStartTimeRef.current[effectName] = performance.now();
        console.time(`[${module}:${component}] Effect: ${effectName}`);
        
        // Run the effect
        const cleanup = effectFn();
        
        // Measure setup time
        const setupEndTime = performance.now();
        const setupDuration = setupEndTime - effectStartTimeRef.current[effectName];
        console.timeEnd(`[${module}:${component}] Effect: ${effectName}`);
        console.log(`[${module}:${component}] Effect ${effectName} setup: ${setupDuration.toFixed(2)}ms`);
        
        // Return wrapped cleanup
        if (typeof cleanup === 'function') {
          return () => {
            const cleanupStartTime = performance.now();
            console.time(`[${module}:${component}] Effect cleanup: ${effectName}`);
            
            // Run the cleanup
            cleanup();
            
            // Measure cleanup time
            console.timeEnd(`[${module}:${component}] Effect cleanup: ${effectName}`);
            const cleanupEndTime = performance.now();
            const cleanupDuration = cleanupEndTime - cleanupStartTime;
            console.log(`[${module}:${component}] Effect ${effectName} cleanup: ${cleanupDuration.toFixed(2)}ms`);
          };
        }
      };
    },
    [enabled, trackEffects, module, component]
  );

  // Create a function to measure any function execution
  const measureFunction = useCallback(
    <T extends (...args: any[]) => any>(
      functionName: string,
      fn: T
    ): T => {
      if (!enabled) {
        return fn;
      }
      
      return ((...args: Parameters<T>): ReturnType<T> => {
        return measurePerformance(
          module,
          component,
          functionName,
          () => fn(...args)
        );
      }) as T;
    },
    [enabled, module, component]
  );

  return {
    measureEffect,
    measureFunction,
  };
}
