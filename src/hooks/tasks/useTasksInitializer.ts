
import { useTaskActions } from './useTaskActions';

export const useTasksInitializer = () => {
  const { forceTagsUpdate, checkPendingHabits } = useTaskActions();
  
  const initializeTasks = () => {
    // Initialize tasks logic here
    console.log("Initializing tasks");
    
    // Force update tags after initialization
    forceTagsUpdate();
    
    // Check for pending habits
    checkPendingHabits();
  };
  
  return {
    initializeTasks
  };
};
