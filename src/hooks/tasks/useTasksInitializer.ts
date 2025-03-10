
import { useEffect, useState, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useTaskEvents } from './useTaskEvents';

/**
 * Hook to initialize tasks and handle task-related events on page load
 * with optimized event flow to prevent redundant processing
 */
export const useTasksInitializer = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initProcessedRef = useRef(false);

  // Coordinated initialization to prevent redundant processing
  useEffect(() => {
    // Only run the initialization once
    if (!pageLoaded && !initProcessedRef.current) {
      console.log("useTasksInitializer: Running coordinated initialization");
      initProcessedRef.current = true;
      
      // Create a sequenced initialization
      initTimeoutRef.current = setTimeout(() => {
        // Step 1: Force task data update
        forceTaskUpdate();
        
        // Step 2: Update tags after tasks are loaded
        setTimeout(() => {
          forceTagsUpdate();
          
          // Step 3: Check for pending habits
          setTimeout(() => {
            checkPendingHabits();
            
            // Step 4: Mark initialization as complete
            setPageLoaded(true);
            
            // Step 5: Notify that initialization is complete
            eventManager.emit('app:initialization-complete', {
              component: 'tasks',
              timestamp: new Date().toISOString()
            });
          }, 100);
        }, 100);
      }, 150);
    }
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [pageLoaded, forceTaskUpdate, forceTagsUpdate, checkPendingHabits]);

  // Handle navigation events with debounced processing
  useEffect(() => {
    const lastProcessTime = useRef(0);
    const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Listen for navigation events through the event manager
    const unsubscribe = eventManager.on('nav:route-change', () => {
      const now = Date.now();
      // Only process navigation events if it's been more than 500ms since the last one
      if (now - lastProcessTime.current > 500) {
        console.log("useTasksInitializer: Navigation occurred, processing with debounce");
        
        // Clear any pending timeout
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
        
        // Set a new timeout for processing
        navigationTimeoutRef.current = setTimeout(() => {
          forceTaskUpdate();
          setTimeout(() => forceTagsUpdate(), 100);
          lastProcessTime.current = Date.now();
        }, 200);
      }
    });
    
    // Also listen for window popstate events for browser navigation
    const handleWindowNavigation = () => {
      const now = Date.now();
      if (now - lastProcessTime.current > 500) {
        console.log("useTasksInitializer: Browser navigation detected");
        
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
        
        navigationTimeoutRef.current = setTimeout(() => {
          forceTaskUpdate();
          setTimeout(() => forceTagsUpdate(), 100);
          lastProcessTime.current = Date.now();
        }, 200);
      }
    };
    
    window.addEventListener('popstate', handleWindowNavigation);
    
    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handleWindowNavigation);
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [forceTaskUpdate, forceTagsUpdate]);

  return { pageLoaded };
};
