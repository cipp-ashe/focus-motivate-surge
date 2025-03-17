
import { useCallback, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { NavigateFunction, useLocation } from 'react-router-dom';
import { eventBus } from '@/lib/eventBus';
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
        
        // Also use eventBus as a backup mechanism
        eventBus.emit('timer:set-task', task);
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
        
        // Also use eventBus
        eventBus.emit('timer:set-task', timerTask);
        
        // Update the task type in the system
        eventBus.emit('task:update', {
          taskId: task.id,
          updates: { taskType: 'timer', duration: 1500 }
        });
      }, 300);
      
      toast.success(`Timer set for: ${task.name}`);
    }
  }, [navigate, location.pathname]);

  // Setup event listeners
  useEffect(() => {
    // Listen for timer:set-task events from eventBus
    const unsubscribe = eventBus.on('timer:set-task', (task) => {
      handleTimerTaskSet(task);
    });
    
    return () => {
      unsubscribe();
    };
  }, [handleTimerTaskSet]);

  return { handleTimerTaskSet };
};
