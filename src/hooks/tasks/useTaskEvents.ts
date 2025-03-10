
import { useState, useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook to emit task-related events with optimized coordination and storage sync
 */
export const useTaskEvents = () => {
  const [processing, setProcessing] = useState(false);
  const [forceUpdateTimeout, setForceUpdateTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastForceUpdateTime, setLastForceUpdateTime] = useState(0);
  
  const createTask = useCallback((task: Task) => {
    console.log("useTaskEvents: Creating task", task);
    
    // First, verify the task doesn't already exist
    const exists = taskStorage.taskExistsById(task.id);
    
    if (exists) {
      console.log(`Task ${task.id} already exists, skipping creation`);
      return;
    }
    
    // Add task to storage directly for immediate persistence
    const added = taskStorage.addTask(task);
    
    if (added) {
      // Then emit event for state updates with direct object reference
      eventBus.emit('task:create', task);
      toast.success('Task added 📝');
      
      // Force task update to ensure it appears in UI - but with delay
      setTimeout(() => forceTaskUpdate(), 50);
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
    // Prevent multiple rapid calls with time-based debouncing
    const now = Date.now();
    if (now - lastForceUpdateTime < 1000) {
      console.log("useTaskEvents: Skipping force update, too soon since last update", 
                  now - lastForceUpdateTime, "ms");
      return;
    }
    
    setLastForceUpdateTime(now);
    
    // Prevent simultaneous processing
    if (processing) {
      console.log("useTaskEvents: Task update already in progress, skipping");
      return;
    }
    
    setProcessing(true);
    console.log("useTaskEvents: Forcing task update");
    
    // Clear any existing timeout
    if (forceUpdateTimeout) {
      clearTimeout(forceUpdateTimeout);
      setForceUpdateTimeout(null);
    }
    
    // Dispatch event to trigger reloading with delay
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      
      // Reset processing flag after a delay
      const resetTimeout = setTimeout(() => {
        setProcessing(false);
        setForceUpdateTimeout(null);
      }, 300);
      
      setForceUpdateTimeout(resetTimeout);
    }, 50);
    
    setForceUpdateTimeout(timeout);
  }, [processing, forceUpdateTimeout, lastForceUpdateTime]);

  const forceTagsUpdate = useCallback(() => {
    // Add debouncing to tags update too
    const now = Date.now();
    if (now - lastForceUpdateTime < 800) {
      console.log("useTaskEvents: Skipping tags update, too soon since last update");
      return;
    }
    
    setLastForceUpdateTime(now);
    console.log("useTaskEvents: Forcing tags update");
    window.dispatchEvent(new Event('force-tags-update'));
  }, [lastForceUpdateTime]);

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
