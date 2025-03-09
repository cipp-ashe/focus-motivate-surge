
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTaskEvents } from './useTaskEvents';

export const useTasksNavigation = () => {
  const location = useLocation();
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();
  const processingRef = useRef(false);
  const lastProcessTimeRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle location changes with debouncing
  useEffect(() => {
    console.log("TasksNavigation: Location changed to", location.pathname);
    
    // Debounce processing to avoid redundant calls
    const now = Date.now();
    if (processingRef.current || (now - lastProcessTimeRef.current < 500)) {
      console.log("TasksNavigation: Skipping redundant processing");
      return;
    }
    
    // Process tasks with a coordinated approach
    const processTasksOnNavigation = () => {
      processingRef.current = true;
      console.log("TasksNavigation: Processing tasks after navigation");
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout for sequential processing
      timeoutRef.current = setTimeout(() => {
        // Step 1: Update tasks
        forceTaskUpdate();
        
        // Step 2: Update tags
        setTimeout(() => {
          forceTagsUpdate();
          
          // Step 3: Check for pending habits on relevant pages
          if (location.pathname === '/' || location.pathname === '/timer') {
            setTimeout(() => {
              checkPendingHabits();
              processingRef.current = false;
              lastProcessTimeRef.current = Date.now();
            }, 100);
          } else {
            processingRef.current = false;
            lastProcessTimeRef.current = Date.now();
          }
        }, 100);
      }, 150);
    };

    // Process tasks when location changes
    processTasksOnNavigation();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location, forceTaskUpdate, forceTagsUpdate, checkPendingHabits]);

  return { currentPath: location.pathname };
};
