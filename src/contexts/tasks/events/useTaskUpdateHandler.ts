
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
  
  // Add new handler for task dismissal - fix the issue with missing fields
  const handleTaskDismiss = useCallback(({ taskId, habitId, date }) => {
    console.log("TaskEvents: Dismissing habit task", taskId, "for habit", habitId, "on", date);
    
    // Ensure we have valid values for habitId and date
    const safeHabitId = habitId || 'none';
    const safeDate = date || new Date().toISOString();
    
    dispatch({ type: 'DISMISS_TASK', payload: { taskId, habitId: safeHabitId, date: safeDate } });
    
    // Emit an event to track this dismissal in the habit system
    window.dispatchEvent(new CustomEvent('habit-task-dismissed', {
      detail: { habitId: safeHabitId, taskId, date: safeDate }
    }));
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
    handleTaskSelect,
    handleTaskDismiss
  };
};
