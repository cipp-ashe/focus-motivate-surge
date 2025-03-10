
import { useTaskActions } from './useTaskActions';

export const useTemplateTasksManager = () => {
  const { forceTagsUpdate, checkPendingHabits } = useTaskActions();
  
  // Template tasks management logic
  const processTemplates = () => {
    console.log("Processing templates");
    
    // Force update tags after processing
    forceTagsUpdate();
    
    // Check for pending habits
    checkPendingHabits();
  };
  
  return {
    processTemplates
  };
};
