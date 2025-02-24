
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

export const useTimerEvents = () => {
  const handleTimerStart = useCallback((taskName: string, duration: number) => {
    console.log('Timer event - Task selected:', { taskName, duration });
    
    // Initialize the timer and start it immediately
    eventBus.emit('timer:init', {
      taskName,
      duration,
    });

    // After a short delay to ensure initialization is complete, start the timer
    setTimeout(() => {
      eventBus.emit('timer:start', { 
        taskName, 
        duration,
        currentTime: duration
      });
    }, 100);
  }, []);

  return {
    handleTimerStart
  };
};
