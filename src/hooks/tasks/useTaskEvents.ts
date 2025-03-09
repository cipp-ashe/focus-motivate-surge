
import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';

/**
 * Hook to emit task-related events with optimized coordination
 */
export const useTaskEvents = () => {
  const processingRef = useRef(false);
  const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const createTask = useCallback((task: Task) => {
    console.log("useTaskEvents: Creating task", task);
    eventBus.emit('task:create', task);
    toast.success('Task added 📝');
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log("useTaskEvents: Updating task", taskId, updates);
    eventBus.emit('task:update', { taskId, updates });
  }, []);

  const deleteTask = useCallback((taskId: string, reason: 'manual' | 'completed' | 'template-removed' = 'manual') => {
    console.log("useTaskEvents: Deleting task", taskId, "reason:", reason);
    eventBus.emit('task:delete', { taskId, reason });
    
    if (reason === 'manual') {
      toast.success('Task deleted 🗑️');
    } else if (reason === 'template-removed') {
      toast.info('Task removed with habit template');
    }
  }, []);

  const completeTask = useCallback((taskId: string, metrics: any) => {
    console.log("useTaskEvents: Completing task", taskId);
    eventBus.emit('task:complete', { taskId, metrics });
    toast.success('Task completed 🎯');
  }, []);

  const selectTask = useCallback((taskId: string) => {
    console.log("useTaskEvents: Selecting task", taskId);
    eventBus.emit('task:select', taskId);
  }, []);

  const forceTaskUpdate = useCallback(() => {
    // Prevent multiple rapid calls
    if (processingRef.current) {
      console.log("useTaskEvents: Task update already in progress, skipping");
      return;
    }
    
    processingRef.current = true;
    console.log("useTaskEvents: Forcing task update");
    
    // Clear any existing timeout
    if (forceUpdateTimeoutRef.current) {
      clearTimeout(forceUpdateTimeoutRef.current);
    }
    
    window.dispatchEvent(new Event('force-task-update'));
    
    // Reset processing flag after a delay
    forceUpdateTimeoutRef.current = setTimeout(() => {
      processingRef.current = false;
    }, 200);
  }, []);

  const forceTagsUpdate = useCallback(() => {
    console.log("useTaskEvents: Forcing tags update");
    window.dispatchEvent(new Event('force-tags-update'));
  }, []);

  const checkPendingHabits = useCallback(() => {
    console.log("useTaskEvents: Checking pending habits");
    eventBus.emit('habits:check-pending', {});
  }, []);

  return {
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
