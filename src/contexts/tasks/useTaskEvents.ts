
import { useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { useTaskUpdateHandler } from './events/useTaskUpdateHandler';

/**
 * Hook to manage task events
 */
export const useTaskEvents = (
  tasks: Task[], 
  completedTasks: Task[], 
  dispatch: React.Dispatch<any>
) => {
  // Get task event handlers
  const {
    handleTaskComplete,
    handleTaskDelete,
    handleTaskUpdate,
    handleTaskSelect,
    handleTaskDismiss // Import the new handler
  } = useTaskUpdateHandler(dispatch);
  
  // Force reload of tasks from storage
  const forceTasksReload = useCallback(() => {
    console.log("TaskEvents: Forcing tasks reload");
    window.dispatchEvent(new Event('force-task-update'));
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    console.log("TaskEvents: Setting up event listeners");
    
    const unsubTaskCreate = eventBus.on('task:create', (task) => {
      console.log("TaskEvents: Task created", task.id);
      dispatch({ type: 'ADD_TASK', payload: task });
    });
    
    const unsubTaskUpdate = eventBus.on('task:update', handleTaskUpdate);
    const unsubTaskDelete = eventBus.on('task:delete', handleTaskDelete);
    const unsubTaskComplete = eventBus.on('task:complete', handleTaskComplete);
    const unsubTaskSelect = eventBus.on('task:select', handleTaskSelect);
    
    // Add new subscription for task dismiss event
    const unsubTaskDismiss = eventBus.on('task:dismiss', handleTaskDismiss);
    
    // Clean up subscriptions
    return () => {
      unsubTaskCreate();
      unsubTaskUpdate();
      unsubTaskDelete();
      unsubTaskComplete();
      unsubTaskSelect();
      unsubTaskDismiss(); // Clean up the new subscription
    };
  }, [dispatch, handleTaskComplete, handleTaskDelete, handleTaskUpdate, handleTaskSelect, handleTaskDismiss]);
  
  return { forceTasksReload };
};
