
import { useState, useCallback, useRef, useEffect } from 'react';
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
  const pendingTasksRef = useRef<Task[]>([]);
  
  // Initialize event listeners
  useEffect(() => {
    console.log("useTaskEvents: Setting up task event listeners");
    
    // Listen for task:create events
    const unsubCreate = eventBus.on('task:create', (task: Task) => {
      createTask(task);
    });
    
    // Listen for task:update events
    const unsubUpdate = eventBus.on('task:update', ({ taskId, updates }) => {
      updateTask(taskId, updates);
    });
    
    // Listen for task:delete events
    const unsubDelete = eventBus.on('task:delete', ({ taskId, reason }) => {
      deleteTask(taskId, reason);
    });
    
    // Listen for task:complete events
    const unsubComplete = eventBus.on('task:complete', ({ taskId, metrics }) => {
      completeTask(taskId, metrics);
    });
    
    // Listen for task:select events
    const unsubSelect = eventBus.on('task:select', (taskId) => {
      selectTask(taskId);
    });
    
    // Clean up event listeners
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubComplete();
      unsubSelect();
    };
  }, []);
  
  // Process any pending tasks periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingTasksRef.current.length > 0 && !processing) {
        console.log(`useTaskEvents: Processing ${pendingTasksRef.current.length} pending tasks`);
        const tasks = [...pendingTasksRef.current];
        pendingTasksRef.current = [];
        
        // Process tasks one by one with delays
        processPendingTasks(tasks);
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [processing]);
  
  const processPendingTasks = useCallback(async (tasks: Task[]) => {
    if (tasks.length === 0) return;
    
    setProcessing(true);
    console.log(`useTaskEvents: Processing ${tasks.length} pending tasks`);
    
    // Process each task with a delay to avoid race conditions
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      
      // Check if task exists in storage to avoid duplicates
      const exists = taskStorage.taskExistsById(task.id);
      
      if (!exists) {
        console.log(`useTaskEvents: Adding pending task ${i+1}/${tasks.length}:`, task.id);
        taskStorage.addTask(task);
        eventBus.emit('task:created', task);
      } else {
        console.log(`useTaskEvents: Task ${task.id} already exists, skipping`);
      }
      
      // Add a small delay between tasks
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Force UI update after all tasks are processed
    setTimeout(() => {
      forceTaskUpdate();
      setProcessing(false);
    }, 200);
  }, []);
  
  const createTask = useCallback((task: Task) => {
    console.log("useTaskEvents: Creating task", task);
    
    // Using direct storage method to avoid race conditions
    const exists = taskStorage.taskExistsById(task.id);
    
    if (exists) {
      console.log(`Task ${task.id} already exists in storage, skipping creation`);
      return false;
    }
    
    // If we're currently processing, add to pending queue
    if (processing) {
      console.log(`useTaskEvents: System busy, queueing task ${task.id}`);
      pendingTasksRef.current.push(task);
      return true;
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
  }, [processing]);

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
    if (now - lastForceUpdateTime < 300) {
      console.log("useTaskEvents: Skipping force update, too recent", 
                  now - lastForceUpdateTime, "ms");
      return;
    }
    
    setLastForceUpdateTime(now);
    
    console.log("useTaskEvents: Forcing task update");
    
    // Dispatch event
    window.dispatchEvent(new Event('force-task-update'));
  }, [lastForceUpdateTime]);

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
