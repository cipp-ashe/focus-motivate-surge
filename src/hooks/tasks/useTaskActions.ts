
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';

/**
 * Hook providing task-related actions
 */
export const useTaskActions = () => {
  // Create task
  const createTask = useCallback((task: Task) => {
    eventManager.emit('task:create', task);
  }, []);

  // Update task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    eventManager.emit('task:update', { taskId, updates });
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    eventManager.emit('task:delete', { taskId, reason });
  }, []);

  // Complete task
  const completeTask = useCallback((taskId: string, metrics?: any) => {
    eventManager.emit('task:complete', { taskId, metrics });
  }, []);

  // Force update tasks
  const forceTaskUpdate = useCallback(() => {
    window.dispatchEvent(new Event('force-task-update'));
    eventManager.emit('task:reload', {});
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    forceTaskUpdate
  };
};
