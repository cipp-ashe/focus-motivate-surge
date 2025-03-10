
import { useCallback } from 'react';

/**
 * Hook for handling task update events
 */
export const useTaskUpdateHandler = (dispatch: React.Dispatch<any>) => {
  // Handle task completion
  const handleTaskComplete = useCallback(({ taskId, metrics }) => {
    console.log("TaskEvents: Completing task", taskId);
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, metrics } });
  }, [dispatch]);
  
  // Handle task deletion
  const handleTaskDelete = useCallback(({ taskId, reason }) => {
    console.log("TaskEvents: Deleting task", taskId, "reason:", reason);
    dispatch({ type: 'DELETE_TASK', payload: { taskId, reason } });
  }, [dispatch]);
  
  // Handle task updates
  const handleTaskUpdate = useCallback(({ taskId, updates }) => {
    console.log("TaskEvents: Updating task", taskId);
    dispatch({ type: 'UPDATE_TASK', payload: { taskId, updates } });
  }, [dispatch]);
  
  // Handle task selection
  const handleTaskSelect = useCallback((taskId) => {
    console.log("TaskEvents: Selecting task", taskId);
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, [dispatch]);
  
  return {
    handleTaskComplete,
    handleTaskDelete,
    handleTaskUpdate,
    handleTaskSelect
  };
};
