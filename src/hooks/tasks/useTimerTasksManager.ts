
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * A hook to manage timer-specific task behaviors, like converting
 * tasks to timer tasks when selected in the timer view
 */
export const useTimerTasksManager = () => {
  const { items, selected } = useTaskContext();
  
  // Auto-convert selected non-timer tasks to timer tasks ONLY when selected in Timer view
  useEffect(() => {
    // We need to check if we're in the Timer route before auto-converting
    const isTimerRoute = window.location.pathname.includes('/timer');
    
    // Only process if we have a selected task AND we're on the timer page
    if (selected && isTimerRoute) {
      const selectedTask = items.find(task => task.id === selected);
      
      if (selectedTask && selectedTask.taskType !== 'timer') {
        console.log('TimerTasksManager: Converting task to timer task:', selectedTask.name);
        
        // Update the task type to timer
        eventBus.emit('task:update', {
          taskId: selectedTask.id,
          updates: { taskType: 'timer' }
        });
        
        toast.success(`Task converted to timer task`);
      }
    }
  }, [selected, items]);
  
  // Handle task selection
  const handleTaskSelect = useCallback((taskId: string) => {
    console.log('TimerTasksManager: Task selected:', taskId);
    
    // Don't auto-convert tasks when not in timer view
    const isTimerRoute = window.location.pathname.includes('/timer');
    
    if (!isTimerRoute) {
      // If not in timer route, just select the task without conversion
      eventBus.emit('task:select', taskId);
      return;
    }
    
    // In timer route, find the task to check its type
    const task = items.find(t => t.id === taskId);
    
    if (task) {
      if (task.taskType !== 'timer') {
        console.log('TimerTasksManager: Converting task to timer task:', task.name);
        
        // Update the task type to timer
        eventBus.emit('task:update', {
          taskId: task.id,
          updates: { taskType: 'timer' }
        });
        
        toast.success(`Task converted to timer task`);
      }
      
      // Select the task
      eventBus.emit('task:select', taskId);
    } else {
      // Task might be in storage but not in memory yet, try to load it
      const storedTask = taskStorage.getTaskById(taskId);
      if (storedTask) {
        console.log('TimerTasksManager: Found task in storage:', storedTask);
        
        // Convert to timer task if needed
        if (storedTask.taskType !== 'timer') {
          eventBus.emit('task:update', {
            taskId: storedTask.id,
            updates: { taskType: 'timer' }
          });
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
