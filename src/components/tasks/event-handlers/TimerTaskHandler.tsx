
import { useCallback, useEffect } from 'react';
import { Task, TaskType } from '@/types/tasks';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useTimerTaskHandler = (navigate: NavigateFunction) => {
  const location = useLocation();
  
  // Handler for timer task selection
  const handleTimerTaskSet = useCallback((task: Task) => {
    console.log('TimerTaskHandler: Timer task set event received for', task.id, 'type:', task.taskType);
    
    // Handle both timer and focus tasks
    if (task.taskType === 'timer' || task.taskType === 'focus') {
      // Navigate to timer page if not already there
      if (!location.pathname.includes('/timer')) {
        navigate('/timer');
      }
      
      // Send the task to the timer with a small delay
      setTimeout(() => {
        const event = new CustomEvent('timer:set-task', { detail: task });
        window.dispatchEvent(event);
        
        // Also use eventManager
        eventManager.emit('timer:set-task', {
          id: task.id,
          name: task.name,
          duration: task.duration || 1500,
          completed: task.completed,
          createdAt: task.createdAt
        });
      }, 300);
      
      toast.success(`Timer set for: ${task.name}`);
    } else {
      // If not a timer or focus task, convert it to a timer task
      console.log('TimerTaskHandler: Converting task to timer:', task);
      
      // Create a timer version of the task
      // Explicitly cast the taskType as TaskType to ensure type safety
      const timerTask: Task = {
        ...task,
        taskType: 'timer' as TaskType, // Use explicit type assertion
        duration: 1500 // Default 25 minutes
      };
      
      // Navigate to timer page if not already there
      if (!location.pathname.includes('/timer')) {
        navigate('/timer');
      }
      
      // Send the timer task
      setTimeout(() => {
        const event = new CustomEvent('timer:set-task', { detail: timerTask });
        window.dispatchEvent(event);
        
        // Also use eventManager
        eventManager.emit('timer:set-task', {
          id: timerTask.id,
          name: timerTask.name,
          duration: timerTask.duration || 1500,
          completed: timerTask.completed,
          createdAt: timerTask.createdAt
        });
        
        // Update the task type in the system
        eventManager.emit('task:update', {
          taskId: task.id,
          updates: { taskType: 'timer' as TaskType, duration: 1500 }
        });
      }, 300);
      
      toast.success(`Timer set for: ${task.name}`);
    }
  }, [navigate, location.pathname]);

  // Setup event listeners
  useEffect(() => {
    // Listen for timer:set-task events from eventManager
    const unsubscribe = eventManager.on('timer:set-task', (payload) => {
      // Ensure we have a valid task to work with
      if (payload && typeof payload === 'object' && 'id' in payload && 'name' in payload) {
        // Create a full Task object from the payload
        const task: Task = {
          id: payload.id as string,
          name: payload.name as string,
          duration: (payload.duration as number) || 1500,
          completed: payload.completed as boolean || false,
          createdAt: (payload.createdAt as string) || new Date().toISOString(),
          taskType: 'timer' as TaskType
        };
        
        handleTimerTaskSet(task);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [handleTimerTaskSet]);

  return { handleTimerTaskSet };
};
