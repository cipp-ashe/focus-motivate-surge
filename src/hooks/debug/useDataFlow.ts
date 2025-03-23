
/**
 * Hook for tracing data flow through components
 */
import { useRef, useEffect } from 'react';
import { traceData, DebugModule } from '@/utils/debug';

interface UseDataFlowOptions {
  module: DebugModule;
  component: string;
  enabled?: boolean;
  includeRenders?: boolean;
  traceProps?: boolean;
  traceDeps?: boolean;
}

export function useDataFlow<T extends Record<string, any>>(
  props: T,
  options: UseDataFlowOptions
) {
  const {
    module,
    component,
    enabled = true,
    includeRenders = true,
    traceProps = true,
    traceDeps = false,
  } = options;

  // Store previous props for comparison
  const prevPropsRef = useRef<T | null>(null);
  
  // Track component renders
  const renderCountRef = useRef(0);
  
  // Track component mount time
  const mountTimeRef = useRef(Date.now());

  // Trace initial mount
  useEffect(() => {
    if (!enabled) return;
    
    renderCountRef.current = 1;
    mountTimeRef.current = Date.now();
    
    traceData(
      module,
      component,
      `Component mounted`,
      { 
        mountTime: new Date(mountTimeRef.current).toISOString(),
        initialProps: props 
      }
    );
    
    return () => {
      if (!enabled) return;
      
      const unmountTime = Date.now();
      const lifetimeMs = unmountTime - mountTimeRef.current;
      
      traceData(
        module,
        component,
        `Component unmounted after ${lifetimeMs}ms with ${renderCountRef.current} renders`,
        { 
          mountTime: new Date(mountTimeRef.current).toISOString(),
          unmountTime: new Date(unmountTime).toISOString(),
          lifetimeMs,
          renderCount: renderCountRef.current
        }
      );
    };
  }, []);

  // Trace prop changes on each render
  useEffect(() => {
    if (!enabled) return;
    
    // Track renders
    renderCountRef.current += 1;
    
    if (includeRenders) {
      traceData(
        module,
        component,
        `Render #${renderCountRef.current}`,
        { renderTime: new Date().toISOString() }
      );
    }
    
    // Skip first render for prop change detection
    if (!prevPropsRef.current) {
      prevPropsRef.current = { ...props };
      return;
    }
    
    // Only trace props if enabled
    if (traceProps) {
      // Find changed props
      const changedProps: Record<string, { prev: any; current: any }> = {};
      let hasChanges = false;
      
      Object.keys(props).forEach(key => {
        if (props[key] !== prevPropsRef.current?.[key]) {
          changedProps[key] = {
            prev: prevPropsRef.current?.[key],
            current: props[key]
          };
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        traceData(
          module,
          component,
          `Props changed on render #${renderCountRef.current}`,
          changedProps
        );
      }
    }
    
    // Update prev props reference
    prevPropsRef.current = { ...props };
  });

  // Return trace functions that can be used within the component
  return {
    traceEvent: (eventName: string, data?: any) => {
      if (!enabled) return;
      traceData(module, component, eventName, data);
    },
    
    traceFunction: (fnName: string, data?: any) => {
      if (!enabled) return (fn: Function) => fn;
      
      return (fn: Function) => (...args: any[]) => {
        traceData(
          module, 
          component, 
          `Function ${fnName} called`,
          { args, ...data }
        );
        
        const result = fn(...args);
        
        traceData(
          module,
          component,
          `Function ${fnName} returned`,
          { result, ...data }
        );
        
        return result;
      };
    }
  };
}
