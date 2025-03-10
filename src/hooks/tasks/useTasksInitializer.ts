
import { useEffect } from 'react';
import { useTaskEvents } from './useTaskEvents';

export const useTasksInitializer = () => {
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();
  
  useEffect(() => {
    // Initialize tasks on component mount
    forceTaskUpdate();
    forceTagsUpdate();
    checkPendingHabits();
    
    // Set up interval to periodically check for pending habits
    const interval = setInterval(() => {
      checkPendingHabits();
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(interval);
    };
  }, [forceTaskUpdate, forceTagsUpdate, checkPendingHabits]);
  
  return { forceTaskUpdate, forceTagsUpdate, checkPendingHabits };
};
