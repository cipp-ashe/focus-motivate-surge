
import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook to handle task updates during navigation
 */
export const useTaskNavigation = (forceReload: () => void) => {
  const lastNavTimeRef = useRef(Date.now());
  
  const handleRouteChange = useCallback(() => {
    const now = Date.now();
    // Prevent multiple rapid navigations from causing excessive reloads
    if (now - lastNavTimeRef.current < 300) {
      console.log("TaskNavigation: Skipping rapid navigation reload");
      return;
    }
    
    lastNavTimeRef.current = now;
    console.log("TaskNavigation: Route changed, reloading tasks");
    
    // Add a small delay to ensure route change is complete
    setTimeout(() => {
      forceReload();
    }, 50);
  }, [forceReload]);
  
  useEffect(() => {
    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [handleRouteChange]);
};
