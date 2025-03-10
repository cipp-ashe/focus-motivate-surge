
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
  const [lastForceUpdateTime, setLastForceUpdateTime] = useState(0);
  
  const createTask = useCallback((task: Task) => {
    console.log("useTaskEvents: Creating task", task);
    
    // Using direct storage method to avoid race conditions
    const exists = taskStorage.taskExistsById(task.id);
    
    if (exists) {
      console.log(`Task ${task.id} already exists in storage, skipping creation`);
      return;
    }
    
    // Add task to storage and emit event
    const added = taskStorage.addTask(task);
    
    if (added) {
      // Load current tasks to make sure we're working with latest data
      const currentTasks = taskStorage.loadTasks();
      console.log(`Current tasks in storage after add: ${currentTasks.length}`);
      
      eventBus.emit('task:create', task);
      toast.success('Task added 📝');
      
      // Force UI update
      setTimeout(() => forceTaskUpdate(), 50);
    }
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log("useTaskEvents: Updating task", taskId, updates);
    
    // Update storage and emit event
    const updated = taskStorage.updateTask(taskId, updates);
    
    if (updated) {
      eventBus.emit('task:update', { taskId, updates });
    } else {
      console.log(`Task ${taskId} not found for update`);
    }
  }, []);

  const deleteTask = useCallback((taskId: string, reason: 'manual' | 'completed' | 'template-removed' = 'manual') => {
    console.log("useTaskEvents: Deleting task", taskId, "reason:", reason);
    
    // Remove from storage and emit event
    const removed = taskStorage.removeTask(taskId);
    
    if (removed) {
      eventBus.emit('task:delete', { taskId, reason });
      
      if (reason === 'manual') {
        toast.success('Task deleted 🗑️');
      }
    }
    
    // Force UI update
    setTimeout(() => forceTaskUpdate(), 50);
  }, []);

  const completeTask = useCallback((taskId: string, metrics: any) => {
    console.log("useTaskEvents: Completing task", taskId);
    
    // Complete in storage and emit event
    const completed = taskStorage.completeTask(taskId, metrics);
    
    if (completed) {
      eventBus.emit('task:complete', { taskId, metrics });
      toast.success('Task completed 🎯');
    }
  }, []);

  const selectTask = useCallback((taskId: string) => {
    console.log("useTaskEvents: Selecting task", taskId);
    eventBus.emit('task:select', taskId);
  }, []);

  const forceTaskUpdate = useCallback(() => {
    // Debounce updates
    const now = Date.now();
    if (now - lastForceUpdateTime < 500) {
      console.log("useTaskEvents: Skipping force update, too recent", 
                  now - lastForceUpdateTime, "ms");
      return;
    }
    
    setLastForceUpdateTime(now);
    
    if (processing) {
      console.log("useTaskEvents: Task update already in progress");
      return;
    }
    
    setProcessing(true);
    console.log("useTaskEvents: Forcing task update");
    
    // Dispatch event
    window.dispatchEvent(new Event('force-task-update'));
    
    // Reset processing flag
    setTimeout(() => {
      setProcessing(false);
    }, 300);
  }, [processing, lastForceUpdateTime]);

  // Add the required functions for useTasksInitializer and useTasksNavigation
  const forceTagsUpdate = useCallback(() => {
    console.log("useTaskEvents: Forcing tags update");
    // Dispatch a custom event for tag updates
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
