
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { eventManager } from '@/lib/events/EventManager';
import { TimerEventType } from '@/types/events';
import { useTaskEvents } from './useTaskEvents';
import { useEvent } from '@/hooks/useEvent';
import { toast } from '@/hooks/use-toast';

/**
 * A specialized hook for managing tasks in the timer view
 */
export const useTimerTasksManager = () => {
  const { forceTaskUpdate } = useTaskEvents();
  
  // Listen for task selection to start the timer
  useEvent('task:select', (taskId: string) => {
    console.log(`TimerTasksManager: Task selected: ${taskId}`);
    
    // Find the task in local storage to get its details
    const taskList = JSON.parse(localStorage.getItem('taskList') || '[]');
    const task = taskList.find((t: Task) => t.id === taskId);
    
    if (task) {
      if (task.taskType !== 'timer') {
        // Convert the task to a timer task if it's not already
        eventBus.emit('task:update', {
          taskId,
          updates: { taskType: 'timer' }
        });
        
        toast.success('Task converted to timer task');
      }
      
      // Let the timer component know to start the timer with this task
      eventManager.emit('timer:set-task' as TimerEventType, task);
    }
  });
  
  // Function to update a task's duration
  const updateTaskDuration = useCallback((taskId: string, durationInSeconds: number) => {
    eventBus.emit('task:update', {
      taskId,
      updates: { duration: durationInSeconds }
    });
    
    // Force update to reflect the changes
    setTimeout(() => {
      forceTaskUpdate();
    }, 100);
  }, [forceTaskUpdate]);
  
  // Function to filter timer tasks
  const getTimerTasks = useCallback((): Task[] => {
    try {
      const allTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      return allTasks.filter((task: Task) => task.taskType === 'timer');
    } catch (e) {
      console.error('Error loading timer tasks:', e);
      return [];
    }
  }, []);
  
  return {
    updateTaskDuration,
    getTimerTasks,
    forceTaskUpdate
  };
};
