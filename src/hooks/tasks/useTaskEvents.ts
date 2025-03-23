
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';
import { TaskEventType } from '@/types/events';

/**
 * A unified hook that provides task-related event functions
 */
export const useTaskEvents = () => {
  // Force update task list
  const forceTaskUpdate = useCallback(() => {
    console.log("TaskEvents: Force updating task list (debounced)");
    
    // Force update via window event (legacy method)
    window.dispatchEvent(new Event('force-task-update'));
    
    // Also emit via event manager
    eventManager.emit('task:reload' as TaskEventType, {});
  }, []);
  
  // Create a new task
  const createTask = useCallback((task: Task) => {
    eventManager.emit('task:create' as TaskEventType, task);
  }, []);

  // Update an existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    eventManager.emit('task:update' as TaskEventType, { taskId, updates });
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    eventManager.emit('task:delete' as TaskEventType, { taskId, reason });
  }, []);

  // Complete a task
  const completeTask = useCallback((taskId: string, metrics?: any) => {
    eventManager.emit('task:complete' as TaskEventType, { taskId, metrics });
  }, []);

  // Select a task for editing
  const selectTask = useCallback((taskId: string | null) => {
    eventManager.emit('task:select' as TaskEventType, taskId);
  }, []);

  // Dismiss a task (especially for habits)
  const dismissTask = useCallback((taskId: string, habitId?: string, date?: string) => {
    eventManager.emit('task:dismiss' as TaskEventType, { 
      taskId, 
      habitId, 
      date: date || new Date().toISOString() 
    });
  }, []);
  
  return {
    forceTaskUpdate,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    dismissTask
  };
};
