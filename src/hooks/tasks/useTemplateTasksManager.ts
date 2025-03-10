
import { useCallback } from 'react';
import { useTaskEvents } from './useTaskEvents';
import { useTaskManager } from './useTaskManager';

export const useTemplateTasksManager = () => {
  const { forceTaskUpdate, forceTagsUpdate, checkPendingHabits } = useTaskEvents();
  const { deleteTask } = useTaskManager();
  
  const deleteTasksByTemplateId = useCallback((templateId: string) => {
    // This would need to find all tasks related to this template and delete them
    console.log('Deleting tasks for template:', templateId);
    
    // After deleting, force an update
    forceTaskUpdate();
    
    return true;
  }, [forceTaskUpdate, deleteTask]);
  
  return {
    deleteTasksByTemplateId,
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
