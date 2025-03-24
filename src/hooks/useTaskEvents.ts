
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/task';
import { EventType, EventPayload } from '@/types/events';

/**
 * Hook for handling task-related events
 */
export const useTaskEvents = () => {
  // Event subscriptions
  const onTaskCreate = useCallback((callback: (task: Task) => void) => {
    return eventManager.on('task:create', callback);
  }, []);

  const onTaskUpdate = useCallback((callback: (data: { taskId: string, updates: Partial<Task> }) => void) => {
    return eventManager.on('task:update', callback);
  }, []);

  const onTaskDelete = useCallback((callback: (data: { taskId: string, reason?: string }) => void) => {
    return eventManager.on('task:delete', callback);
  }, []);

  const onTaskComplete = useCallback((callback: (data: { taskId: string, metrics?: any }) => void) => {
    return eventManager.on('task:complete', callback);
  }, []);

  const onTaskSelect = useCallback((callback: (taskId: string | null) => void) => {
    return eventManager.on('task:select', callback);
  }, []);

  const onTaskReload = useCallback((callback: () => void) => {
    return eventManager.on('task:reload', callback);
  }, []);

  // Event emission
  const emitEvent = useCallback(<E extends EventType>(eventType: E, payload?: EventPayload<E>) => {
    eventManager.emit(eventType, payload);
  }, []);

  // Specific task event emitters
  const createTask = useCallback((task: Task) => {
    eventManager.emit('task:create', task);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    eventManager.emit('task:update', { taskId, updates });
  }, []);

  const deleteTask = useCallback((taskId: string, reason?: string) => {
    eventManager.emit('task:delete', { taskId, reason });
  }, []);

  const completeTask = useCallback((taskId: string, metrics?: any) => {
    eventManager.emit('task:complete', { taskId, metrics });
  }, []);

  const selectTask = useCallback((taskId: string | null) => {
    eventManager.emit('task:select', taskId);
  }, []);

  const reloadTasks = useCallback(() => {
    eventManager.emit('task:reload', undefined);
  }, []);

  return {
    // Event subscriptions
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
    onTaskComplete,
    onTaskSelect,
    onTaskReload,
    
    // Event emitters
    emitEvent,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    reloadTasks
  };
};

// Export a cleaner alias
export const useTasks = useTaskEvents;
