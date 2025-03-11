
import { useCallback } from 'react';
import { taskRelationshipStorage } from '@/lib/storage/task/taskRelationshipStorage';

/**
 * Hook for handling template-related events
 */
export const useTemplateHandler = (dispatch: React.Dispatch<any>) => {
  // Handle template deletion
  const handleTemplateDelete = useCallback(({ templateId, isOriginatingAction }) => {
    console.log("TaskEvents: Received template delete event for", templateId);
    
    // Dispatch action to delete all tasks related to this template
    dispatch({ type: 'DELETE_TASKS_BY_TEMPLATE', payload: { templateId } });
    
    // If this is the originating action, also clean up storage directly
    if (isOriginatingAction) {
      console.log("TaskEvents: Originating template delete, forcing storage cleanup");
      taskRelationshipStorage.deleteTasksByTemplate(templateId);
      
      // Force a UI refresh after storage cleanup
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 150);
    }
  }, [dispatch]);
  
  return { handleTemplateDelete };
};
