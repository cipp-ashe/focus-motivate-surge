
import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { useTaskEventListeners } from './events/useTaskEventListeners';
import { useTaskReload } from './events/useTaskReload';
import { useTaskUpdateHandler } from './events/useTaskUpdateHandler';

/**
 * Hook for managing task events and event handlers
 */
export const useTaskEvents = (
  items: Task[],
  completed: Task[],
  dispatch: React.Dispatch<any>
) => {
  const [lastEventTime, setLastEventTime] = useState<Record<string, number>>({});
  
  // Set up task update handlers
  const {
    handleTaskComplete,
    handleTaskDelete,
    handleTaskUpdate,
    handleTaskSelect,
    handleTaskDismiss
  } = useTaskUpdateHandler(dispatch);
  
  // Set up task reload handlers
  const {
    preventReentrantUpdate,
    pendingTaskUpdates,
    setPendingTaskUpdates,
    isInitializing,
    setIsInitializing,
    forceTasksReload: reloadTasks,
  } = useTaskReload(dispatch);
  
  // Debounced force reload function
  const forceTasksReload = useCallback(() => {
    reloadTasks(lastEventTime, setLastEventTime);
  }, [reloadTasks, lastEventTime]);
  
  // Task creation handler
  const handleTaskCreate = useCallback((task: Task) => {
    console.log("TaskEvents: Creating task", task);
    
    // Check if task already exists in current state
    const taskExists = items.some(t => t.id === task.id) ||
      items.some(t => 
        t.relationships?.habitId === task.relationships?.habitId && 
        t.relationships?.date === task.relationships?.date
      );
    
    if (taskExists) {
      console.log("TaskEvents: Task already exists, skipping create");
      return;
    }
    
    // Check if we're still initializing
    if (isInitializing || preventReentrantUpdate) {
      console.log("TaskEvents: Storing task for later processing:", task);
      setPendingTaskUpdates(prev => [...prev, task]);
      return;
    }
    
    dispatch({ type: 'ADD_TASK', payload: task });
  }, [dispatch, items, isInitializing, preventReentrantUpdate, setPendingTaskUpdates]);
  
  // Template deletion handler
  const handleTemplateDelete = useCallback(({ templateId, isOriginatingAction }) => {
    console.log("TaskEvents: Deleting all tasks for template", templateId);
    
    // Dispatch action to delete all tasks related to this template
    // This will remove both active and completed/dismissed tasks
    dispatch({ 
      type: 'DELETE_TASKS_BY_TEMPLATE', 
      payload: { templateId } 
    });
    
    // If this is the originating action (from template management),
    // force storage cleanup to ensure consistency
    if (isOriginatingAction) {
      console.log("TaskEvents: Originating template delete, forcing storage cleanup");
      
      // Add small delay to allow state updates to process
      setTimeout(() => {
        forceTasksReload();
      }, 100);
    }
  }, [dispatch, forceTasksReload]);
  
  // Habit check handler - simplified implementation
  const handleHabitCheck = useCallback(() => {
    console.log("TaskEvents: Checking for pending habits");
    // Processing moved to the integration hook
  }, []);
  
  // Set up event listeners using the handlers
  useTaskEventListeners(
    items,
    dispatch,
    {
      handleTaskCreate,
      handleTaskComplete,
      handleTaskDelete,
      handleTaskUpdate,
      handleTaskSelect,
      handleTemplateDelete,
      handleHabitCheck
    },
    forceTasksReload,
    lastEventTime.forceUpdate || 0,
    (time) => setLastEventTime(prev => ({ ...prev, forceUpdate: time }))
  );
  
  return {
    forceTasksReload,
    isInitializing
  };
};
