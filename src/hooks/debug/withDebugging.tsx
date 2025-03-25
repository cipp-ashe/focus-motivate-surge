
import React, { useEffect, useRef } from 'react';
import { useStateDebugger } from './useStateDebugger';
import { useRenderTimer } from './useRenderTimer';
import { useDebugContext } from '@/contexts/debug/DebugContext';

interface DebugOptions {
  trackProps?: boolean;
  trackRenders?: boolean;
  measurePerformance?: boolean;
  logChangesOnly?: boolean;
  warnThreshold?: number;
  errorThreshold?: number;
}

/**
 * Higher-order component that adds debugging capabilities to components
 * 
 * @param WrappedComponent - The component to add debugging to
 * @param componentName - Optional name override (defaults to component displayName)
 * @param options - Debug configuration options
 */
export function withDebugging<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string,
  options: DebugOptions = {}
) {
  const {
    trackProps = true,
    trackRenders = true,
    measurePerformance = true,
    logChangesOnly = true,
    warnThreshold = 16,
    errorThreshold = 50
  } = options;
  
  // Create a debugging-enhanced component
  const WithDebugging = (props: P) => {
    const { isEnabled } = useDebugContext();
    
    // Get component display name
    const displayName = componentName || 
      WrappedComponent.displayName || 
      WrappedComponent.name || 
      'Component';
    
    // Track component lifecycle and props
    const mountTimeRef = useRef(Date.now());
    const prevRenderTimeRef = useRef(Date.now());
    
    // Use debugging hooks
    const { renderCount } = useStateDebugger(
      displayName, 
      trackProps ? { ...props } : {}, 
      { trackRenders, logChangesOnly }
    );

    if (measurePerformance) {
      useRenderTimer(displayName, { warnThreshold, errorThreshold });
    }
    
    // Log mount and update timing
    useEffect(() => {
      if (!isEnabled) return;
      
      const now = Date.now();
      const timeSinceMount = now - mountTimeRef.current;
      const timeSinceLastRender = now - prevRenderTimeRef.current;
      
      if (renderCount === 1) {
        console.log(`🏗️ ${displayName} mounted`);
      } else {
        console.log(`🔄 ${displayName} updated after ${timeSinceLastRender}ms (mounted for ${timeSinceMount}ms)`);
      }
      
      prevRenderTimeRef.current = now;
      
      // Cleanup on unmount
      return () => {
        const unmountTime = Date.now();
        const lifetime = unmountTime - mountTimeRef.current;
        console.log(`🗑️ ${displayName} unmounted after ${lifetime}ms with ${renderCount} renders`);
      };
    }, [isEnabled, displayName, renderCount]);
    
    // Render the original component with its props
    return <WrappedComponent {...props} />;
  };
  
  // Set display name for React DevTools
  WithDebugging.displayName = `withDebugging(${
    WrappedComponent.displayName || 
    WrappedComponent.name || 
    'Component'
  })`;
  
  return WithDebugging;
}
