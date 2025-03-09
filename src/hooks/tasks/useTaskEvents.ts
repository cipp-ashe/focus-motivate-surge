
import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook to emit task-related events with optimized coordination and storage sync
 */
export const useTaskEvents = () => {
  const processingRef = useRef(false);
  const forceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const createTask = useCallback((task: Task) => {
    console.log("useTaskEvents: Creating task", task);
    
    // First, add task to storage directly for immediate persistence
    const added = taskStorage.addTask(task);
    
    if (added) {
      // Then emit event for state updates
      eventBus.emit('task:create', task);
      toast.success('Task added 📝');
    } else {
      console.log(`Task ${task.id} already exists, skipping creation`);
    }
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log("useTaskEvents: Updating task", taskId, updates);
    
    // Update storage first
    const updated = taskStorage.updateTask(taskId, updates);
    
    if (updated) {
      // Then emit event for state updates
      eventBus.emit('task:update', { taskId, updates });
    } else {
      console.log(`Task ${taskId} not found for update`);
    }
  }, []);

  const deleteTask = useCallback((taskId: string, reason: 'manual' | 'completed' | 'template-removed' = 'manual') => {
    console.log("useTaskEvents: Deleting task", taskId, "reason:", reason);
    
    // Remove from storage first
    const removed = taskStorage.removeTask(taskId);
    
    // Emit event for state updates even if not found in storage
    // This ensures any in-memory references are also cleaned up
    eventBus.emit('task:delete', { taskId, reason });
    
    if (removed && reason === 'manual') {
      toast.success('Task deleted 🗑️');
    } else if (removed && reason === 'template-removed') {
      toast.info('Task removed with habit template');
    }
  }, []);

  const completeTask = useCallback((taskId: string, metrics: any) => {
    console.log("useTaskEvents: Completing task", taskId);
    
    // Complete task in storage first
    const completed = taskStorage.completeTask(taskId, metrics);
    
    if (completed) {
      // Then emit event for state updates
      eventBus.emit('task:complete', { taskId, metrics });
      toast.success('Task completed 🎯');
    } else {
      console.log(`Task ${taskId} not found for completion`);
    }
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
    
    // Dispatch event to trigger reloading
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
