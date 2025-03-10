
import { useCallback } from 'react';

/**
 * Hook for handling template-related events
 */
export const useTemplateHandler = (dispatch: React.Dispatch<any>) => {
  // Handle template deletion
  const handleTemplateDelete = useCallback(({ templateId }) => {
    console.log("TaskEvents: Received template delete event for", templateId);
    dispatch({ type: 'DELETE_TASKS_BY_TEMPLATE', payload: { templateId } });
  }, [dispatch]);
  
  return { handleTemplateDelete };
};
