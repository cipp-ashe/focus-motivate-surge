
import { useCallback, useEffect } from 'react';
import { Task } from '@/types/tasks';
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
        eventManager.emit('timer:set-task', task);
      }, 300);
      
      toast.success(`Timer set for: ${task.name}`);
    } else {
      // If not a timer or focus task, convert it to a timer task
      console.log('TimerTaskHandler: Converting task to timer:', task);
      
      // Create a timer version of the task
      const timerTask = {
        ...task,
        taskType: 'timer',
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
        eventManager.emit('timer:set-task', timerTask);
        
        // Update the task type in the system
        eventManager.emit('task:update', {
          taskId: task.id,
          updates: { taskType: 'timer', duration: 1500 }
        });
      }, 300);
      
      toast.success(`Timer set for: ${task.name}`);
    }
  }, [navigate, location.pathname]);

  // Setup event listeners
  useEffect(() => {
    // Listen for timer:set-task events from eventManager
    const unsubscribe = eventManager.on('timer:set-task', (task) => {
      // This expects to get a Task object
      if (task && task.id) {
        // Ensure the task has all required properties for a Task
        if (!task.completed || !task.createdAt) {
          const fullTask: Task = {
            ...task,
            completed: task.completed !== undefined ? task.completed : false,
            createdAt: task.createdAt !== undefined ? task.createdAt : new Date().toISOString()
          };
          
          handleTimerTaskSet(fullTask);
        } else {
          handleTimerTaskSet(task);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [handleTimerTaskSet]);

  return { handleTimerTaskSet };
};
