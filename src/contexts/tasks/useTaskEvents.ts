
import { useCallback, useRef, useState } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useTaskEventListeners } from './events/useTaskEventListeners';
import { useTemplateHandler } from './events/useTemplateHandler';

/**
 * Hook for handling task-related events
 */
export const useTaskEvents = (
  activeTasks: Task[],
  completedTasks: Task[],
  dispatch: React.Dispatch<any>
) => {
  const [lastForceUpdateTime, setLastForceUpdateTime] = useState(0);
  const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Force reload tasks from storage
  const forceTasksReload = useCallback(() => {
    try {
      const result = taskStorage.loadAllTasks();
      
      dispatch({
        type: 'LOAD_TASKS',
        payload: {
          tasks: result.active,
          completed: result.completed
        }
      });
      
      // Clear any pending force update timeout
      if (forceUpdateTimeoutRef.current) {
        clearTimeout(forceUpdateTimeoutRef.current);
        forceUpdateTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error in force tasks reload:', error);
    }
  }, [dispatch]);
  
  // Task event handlers
  const handleTaskCreate = useCallback((task: Task) => {
    console.log(`TaskEvents: Handling task create for ${task.id}`, task);
    dispatch({ type: 'ADD_TASK', payload: task });
  }, [dispatch]);
  
  const handleTaskUpdate = useCallback((data: { taskId: string, updates: any }) => {
    console.log(`TaskEvents: Handling task update for ${data.taskId}`, data.updates);
    dispatch({ type: 'UPDATE_TASK', payload: data });
  }, [dispatch]);
  
  const handleTaskDelete = useCallback((data: { taskId: string, reason?: string }) => {
    console.log(`TaskEvents: Handling task delete for ${data.taskId}`, data);
    dispatch({ type: 'DELETE_TASK', payload: data });
  }, [dispatch]);
  
  const handleTaskComplete = useCallback((data: { taskId: string, metrics?: any }) => {
    console.log(`TaskEvents: Handling task complete for ${data.taskId}`, data);
    dispatch({ type: 'COMPLETE_TASK', payload: data });
  }, [dispatch]);
  
  const handleTaskSelect = useCallback((taskId: string) => {
    console.log(`TaskEvents: Handling task select for ${taskId}`);
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, [dispatch]);
  
  const handleHabitCheck = useCallback(() => {
    console.log("TaskEvents: Checking for pending habits");
    // Simply trigger a force update to ensure all habit tasks are loaded
    forceUpdateTimeoutRef.current = setTimeout(() => {
      forceTasksReload();
    }, 250);
  }, [forceTasksReload]);
  
  // Handle task dismissal (for habit tasks)
  const handleTaskDismiss = useCallback((data: { taskId: string, habitId: string, date: string }) => {
    console.log(`TaskEvents: Handling task dismiss for ${data.taskId}`, data);
    dispatch({ type: 'DISMISS_TASK', payload: data });
    
    // Also dispatch a custom event for habit integration
    window.dispatchEvent(new CustomEvent('habit-task-dismissed', { 
      detail: { habitId: data.habitId, date: data.date }
    }));
  }, [dispatch]);
  
  // Template-related event handlers
  const { handleTemplateDelete } = useTemplateHandler(dispatch);
  
  // Set up event listeners
  useTaskEventListeners(
    activeTasks,
    dispatch,
    {
      handleTaskCreate,
      handleTaskComplete,
      handleTaskDelete,
      handleTaskUpdate,
      handleTaskSelect,
      handleTemplateDelete,
      handleHabitCheck,
      handleTaskDismiss
    },
    forceTasksReload,
    lastForceUpdateTime,
    setLastForceUpdateTime
  );
  
  return {
    forceTasksReload
  };
};
