
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { NavigateFunction } from 'react-router-dom';

export const useTimerTaskHandler = (navigate: NavigateFunction) => {
  // Handler for timer task selection
  const handleTimerTaskSet = useCallback((task: Task) => {
    console.log('TimerTaskHandler: Timer task set event received for', task.id);
    
    // Only handle timer tasks
    if (task.taskType === 'timer') {
      // Navigate to timer page if not already there
      if (!window.location.pathname.includes('/timer')) {
        navigate('/timer');
      }
      
      // Send the task to the timer with a small delay
      setTimeout(() => {
        const event = new CustomEvent('timer:set-task', { detail: task });
        window.dispatchEvent(event);
      }, 300);
    } else {
      console.log('TimerTaskHandler: Ignoring non-timer task for timer page:', task);
    }
  }, [navigate]);

  return { handleTimerTaskSet };
};
