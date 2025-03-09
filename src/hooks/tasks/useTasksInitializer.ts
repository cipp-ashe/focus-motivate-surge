
import { useEffect, useState } from 'react';
import { eventBus } from '@/lib/eventBus';
import { useTaskEvents } from './useTaskEvents';

/**
 * Hook to initialize tasks and handle task-related events on page load
 */
export const useTasksInitializer = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();

  // Force a task update when the page first loads
  useEffect(() => {
    if (!pageLoaded) {
      console.log("useTasksInitializer: Initial load, forcing task and tag updates");
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        forceTaskUpdate();
        forceTagsUpdate();
        
        // Also check if any habit tasks need to be scheduled
        checkPendingHabits();
        
        setPageLoaded(true);
      }, 300); // Delay to ensure other components are ready
    }
  }, [pageLoaded, forceTaskUpdate, forceTagsUpdate, checkPendingHabits]);

  // Force a task update when returning to this page
  useEffect(() => {
    console.log("useTasksInitializer: Component mounted");
    
    // Delay to ensure navigation is complete
    setTimeout(() => {
      forceTaskUpdate();
      forceTagsUpdate();
      
      // Trigger creation of pending habit tasks 
      eventBus.emit('habits:processed', {});
    }, 300); // Delay for more reliable processing
    
    // Set up event listener for popstate (browser back/forward)
    const handlePopState = () => {
      console.log("useTasksInitializer: Navigation occurred, updating tasks");
      setTimeout(() => {
        forceTaskUpdate();
        forceTagsUpdate();
        
        // Also recheck pending habit tasks
        eventBus.emit('habits:processed', {});
      }, 300);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [forceTaskUpdate, forceTagsUpdate]);

  return { pageLoaded };
};
