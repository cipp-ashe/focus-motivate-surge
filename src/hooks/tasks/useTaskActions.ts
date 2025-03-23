
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for task-related actions
 */
export const useTaskActions = () => {
  // Create a new task
  const createTask = useCallback((task: Task) => {
    console.log('Creating task:', task);
    eventManager.emit('task:create', task);
  }, []);

  // Update an existing task
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log(`Updating task ${taskId}:`, updates);
    eventManager.emit('task:update', { taskId, updates });
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string, reason?: string) => {
    console.log(`Deleting task ${taskId}`, reason ? `Reason: ${reason}` : '');
    eventManager.emit('task:delete', { taskId });
  }, []);

  // Complete a task
  const completeTask = useCallback((taskId: string, metrics?: any) => {
    console.log(`Completing task ${taskId}`, metrics ? `Metrics: ${JSON.stringify(metrics)}` : '');
    eventManager.emit('task:complete', { taskId, metrics });
  }, []);

  // Force update task list
  const forceTaskUpdate = useCallback(() => {
    console.log('Forcing task update');
    eventManager.emit('task:force-update', undefined);
  }, []);

  // Force update of tags
  const forceTagsUpdate = useCallback(() => {
    console.log('Forcing tags update');
    // This could emit a specific event for tags
  }, []);

  // Check for pending habits
  const checkPendingHabits = useCallback(() => {
    console.log('Checking pending habits');
    eventManager.emit('habit:check-pending', {});
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
