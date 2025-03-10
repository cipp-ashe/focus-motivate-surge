
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
      return false;
    }
    
    // Add task to storage
    const added = taskStorage.addTask(task);
    
    if (added) {
      // Emit event for task creation
      eventBus.emit('task:created', task);
      
      // Force UI update
      setTimeout(() => forceTaskUpdate(), 50);
      
      // Show success toast
      toast.success('Task added 📝');
      return true;
    }
    
    return false;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    console.log("useTaskEvents: Updating task", taskId, updates);
    
    // Update storage and emit event
    const updated = taskStorage.updateTask(taskId, updates);
    
    if (updated) {
      eventBus.emit('task:updated', { taskId, updates });
      toast.success('Task updated ✏️');
    } else {
      console.log(`Task ${taskId} not found for update`);
    }
  }, []);

  const deleteTask = useCallback((taskId: string, reason: 'manual' | 'completed' | 'template-removed' = 'manual') => {
    console.log("useTaskEvents: Deleting task", taskId, "reason:", reason);
    
    // Remove from storage and emit event
    const removed = taskStorage.removeTask(taskId);
    
    if (removed) {
      eventBus.emit('task:deleted', { taskId, reason });
      
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
      eventBus.emit('task:completed', { taskId, metrics });
      toast.success('Task completed 🎯');
    }
  }, []);

  const selectTask = useCallback((taskId: string) => {
    console.log("useTaskEvents: Selecting task", taskId);
    eventBus.emit('task:selected', taskId);
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

  // Set up event listeners for task operations
  useCallback(() => {
    console.log("Setting up task event listeners");
    
    // Add task event listener
    const unsubCreate = eventBus.on('task:create', (task: Task) => {
      createTask(task);
    });
    
    // Update task event listener
    const unsubUpdate = eventBus.on('task:update', ({ taskId, updates }) => {
      updateTask(taskId, updates);
    });
    
    // Delete task event listener
    const unsubDelete = eventBus.on('task:delete', ({ taskId, reason }) => {
      deleteTask(taskId, reason);
    });
    
    // Complete task event listener
    const unsubComplete = eventBus.on('task:complete', ({ taskId, metrics }) => {
      completeTask(taskId, metrics);
    });
    
    // Select task event listener
    const unsubSelect = eventBus.on('task:select', (taskId) => {
      selectTask(taskId);
    });
    
    // Return cleanup function
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubComplete();
      unsubSelect();
    };
  }, [createTask, updateTask, deleteTask, completeTask, selectTask]);

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
