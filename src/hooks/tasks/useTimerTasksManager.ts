
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * A hook to manage timer-specific task behaviors, like selecting
 * timer tasks when in the timer view
 */
export const useTimerTasksManager = () => {
  const { items, selected } = useTaskContext();
  
  // Handle task selection for the timer view
  const handleTaskSelect = useCallback((taskId: string) => {
    console.log('TimerTasksManager: Task selected:', taskId);
    
    // Check if we're in the timer route
    const isTimerRoute = window.location.pathname.includes('/timer');
    
    // In timer route, find the task to check its type
    const task = items.find(t => t.id === taskId);
    
    if (task) {
      // Only proceed with timer tasks in timer view
      if (isTimerRoute && task.taskType !== 'timer') {
        console.log('TimerTasksManager: Ignoring non-timer task in timer view:', task.name);
        toast.warning(`Only timer tasks can be used in Timer view`);
        return;
      }
      
      // Select the task
      eventBus.emit('task:select', taskId);
    } else {
      // Task might be in storage but not in memory yet, try to load it
      const storedTask = taskStorage.getTaskById(taskId);
      if (storedTask) {
        console.log('TimerTasksManager: Found task in storage:', storedTask);
        
        // Check if it's a timer task when in timer view
        if (isTimerRoute && storedTask.taskType !== 'timer') {
          console.log('TimerTasksManager: Ignoring non-timer task in timer view:', storedTask.name);
          toast.warning(`Only timer tasks can be used in Timer view`);
          return;
        }
        
        // Select the task and trigger a refresh
        eventBus.emit('task:select', taskId);
        window.dispatchEvent(new Event('force-task-update'));
      }
    }
  }, [items]);
  
  // Update a task's duration when changed in the timer
  const updateTaskDuration = useCallback((taskId: string, duration: number) => {
    console.log('TimerTasksManager: Updating task duration:', { taskId, duration });
    eventBus.emit('task:update', {
      taskId,
      updates: { duration }
    });
  }, []);
  
  // Force a task update when needed (e.g., after timer completion)
  const forceTaskUpdate = useCallback((taskId?: string) => {
    console.log('TimerTasksManager: Forcing task update:', taskId || 'all tasks');
    
    if (taskId) {
      // If taskId is provided, reload just that task
      eventBus.emit('task:reload', { taskId });
    } else {
      // If no taskId is provided, trigger a global task reload
      eventBus.emit('task:reload', {});
      
      // Also dispatch a force-task-update event for components listening for it
      window.dispatchEvent(new Event('force-task-update'));
    }
  }, []);
  
  return {
    handleTaskSelect,
    updateTaskDuration,
    forceTaskUpdate
  };
};
