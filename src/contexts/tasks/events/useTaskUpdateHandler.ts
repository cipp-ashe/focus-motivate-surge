
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
    
    // Emit an event to track this dismissal in the habit system - but with a delay to prevent loops
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('habit-task-dismissed', {
        detail: { habitId: safeHabitId, taskId, date: safeDate }
      }));
    }, 50);
  }, [dispatch]);
  
  // Handle task updates - with improved error handling
  const handleTaskUpdate = useCallback(({ taskId, updates }) => {
    console.log("TaskEvents: Updating task", taskId, updates);
    
    // Skip empty updates to prevent unnecessary reducer calls
    if (!updates || Object.keys(updates).length === 0) {
      console.log(`TaskEvents: No updates provided for task ${taskId}, skipping`);
      return;
    }
    
    // Make sure we have a valid taskId
    if (!taskId) {
      console.error("TaskEvents: Attempted to update task without taskId");
      return;
    }
    
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
