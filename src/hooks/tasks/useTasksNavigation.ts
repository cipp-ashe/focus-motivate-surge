
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTaskEvents } from './useTaskEvents';

export const useTasksNavigation = () => {
  const location = useLocation();
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();

  // Handle location changes and navigation events
  useEffect(() => {
    console.log("TasksNavigation: Location changed to", location.pathname);
    
    // Process tasks when page loads or changes
    const processTasksOnNavigation = () => {
      console.log("TasksNavigation: Processing tasks after navigation");
      
      // Small delay to ensure components are ready
      setTimeout(() => {
        forceTaskUpdate();
        forceTagsUpdate();
        
        // When returning to home or timer page, also check for pending habits
        if (location.pathname === '/' || location.pathname === '/timer') {
          checkPendingHabits();
        }
      }, 100);
    };

    // Process immediately on location change
    processTasksOnNavigation();
    
    // Also set up event listener for popstate (browser back/forward)
    const handlePopState = () => {
      console.log("TasksNavigation: Browser navigation occurred");
      processTasksOnNavigation();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, forceTaskUpdate, forceTagsUpdate, checkPendingHabits]);

  return { currentPath: location.pathname };
};
