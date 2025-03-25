
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
        console.error(
          `%c🐢 ${componentName} render: ${duration.toFixed(2)}ms (extremely slow)`,
          'color: #ef4444; font-weight: bold; background-color: rgba(239, 68, 68, 0.1); padding: 2px 4px; border-radius: 2px; dark:background-color: rgba(239, 68, 68, 0.2);'
        );
      } else if (duration > warnThreshold) {
        console.warn(
          `%c⚠️ ${componentName} render: ${duration.toFixed(2)}ms (slow)`,
          'color: #f59e0b; font-weight: bold; background-color: rgba(245, 158, 11, 0.1); padding: 2px 4px; border-radius: 2px; dark:background-color: rgba(245, 158, 11, 0.2);'
        );
      } else {
        console.log(
          `%c⚡ ${componentName} render: ${duration.toFixed(2)}ms`,
          'color: #10b981; font-weight: bold; dark:color: #34d399;'
        );
      }
    }
  }, [isEnabled, componentName, trackRenderTiming, logToConsole, warnThreshold, errorThreshold]);
  
  return {
    startTime: renderStartTimeRef.current
  };
}
