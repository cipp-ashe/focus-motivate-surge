
import { useEffect, useRef, useState } from 'react';
import { useDebugContext } from '@/contexts/debug/DebugContext';

/**
 * Hook to track component lifecycle events with timing information
 * 
 * @param componentName - Name of the component
 * @param dependencies - Optional array of dependencies to track updates
 */
export function useLifecycleTracker(
  componentName: string,
  dependencies: any[] = []
) {
  const { isEnabled } = useDebugContext();
  const mountTimeRef = useRef(Date.now());
  const updateCountRef = useRef(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Track initial mount
  useEffect(() => {
    if (!isEnabled) return;
    
    const mountTime = Date.now();
    mountTimeRef.current = mountTime;
    setIsMounted(true);
    
    console.log(`🏗️ ${componentName} mounted at ${new Date(mountTime).toISOString()}`);
    
    return () => {
      const unmountTime = Date.now();
      const lifetime = unmountTime - mountTimeRef.current;
      
      console.log(`🗑️ ${componentName} unmounted after ${lifetime}ms with ${updateCountRef.current} updates`);
    };
  }, [isEnabled, componentName]);
  
  // Track dependency updates
  useEffect(() => {
    if (!isEnabled || !isMounted) return;
    
    // Skip first run (mount)
    if (updateCountRef.current === 0) {
      updateCountRef.current++;
      return;
    }
    
    updateCountRef.current++;
    const updateTime = Date.now();
    const timeSinceMount = updateTime - mountTimeRef.current;
    
    console.log(`🔄 ${componentName} updated #${updateCountRef.current} after ${timeSinceMount}ms`, {
      dependencies: dependencies.map((dep, i) => ({ 
        [`dep${i}`]: typeof dep === 'function' ? 'function' : dep 
      }))
    });
  }, [isEnabled, componentName, isMounted, ...dependencies]);
  
  return {
    mountTime: mountTimeRef.current,
    updateCount: updateCountRef.current,
    isMounted
  };
}
