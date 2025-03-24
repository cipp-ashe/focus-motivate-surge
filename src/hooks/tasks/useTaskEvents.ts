
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';

/**
 * Hook for subscribing to task-related events
 */
export const useTaskEvents = () => {
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

  return {
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
    onTaskComplete,
    onTaskSelect,
    onTaskReload,
    emit: eventManager.emit
  };
};
