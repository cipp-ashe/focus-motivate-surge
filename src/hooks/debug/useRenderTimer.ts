
import { useRef, useEffect } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

/**
 * Hook to measure and log component render times
 * 
 * @param componentName - Name of the component (for logging)
 * @param options - Configuration options
 */
export function useRenderTimer(
  componentName: string,
  options: {
    logToConsole?: boolean;
    warnThreshold?: number;
    errorThreshold?: number;
  } = {}
) {
  const { 
    isEnabled, 
    trackRenderTiming 
  } = useDebugContext();
  
  const {
    logToConsole = true,
    warnThreshold = 16, // ~60fps
    errorThreshold = 50 // noticeably slow
  } = options;
  
  // Store render start time
  const renderStartTimeRef = useRef(0);
  
  // Start timing on render
  renderStartTimeRef.current = performance.now();
  
  // Finish timing after render
  useEffect(() => {
    if (!isEnabled) return;
    
    const endTime = performance.now();
    const duration = endTime - renderStartTimeRef.current;
    
    // Track the render timing
    trackRenderTiming(componentName, duration);
    
    // Log to console if enabled
    if (logToConsole) {
      if (duration > errorThreshold) {
        console.error(`🐢 ${componentName} render: ${duration.toFixed(2)}ms (extremely slow)`);
      } else if (duration > warnThreshold) {
        console.warn(`⚠️ ${componentName} render: ${duration.toFixed(2)}ms (slow)`);
      } else {
        console.log(`⚡ ${componentName} render: ${duration.toFixed(2)}ms`);
      }
    }
  }, [isEnabled, componentName, trackRenderTiming, logToConsole, warnThreshold, errorThreshold]);
  
  return {
    startTime: renderStartTimeRef.current
  };
}
