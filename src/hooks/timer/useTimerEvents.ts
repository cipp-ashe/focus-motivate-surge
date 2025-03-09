
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

export const useTimerEvents = () => {
  const handleTimerStart = useCallback((taskName: string, durationInSeconds: number) => {
    console.log('Timer event - Task selected:', { taskName, durationInSeconds });
    
    // Initialize the timer and start it immediately
    eventBus.emit('timer:init', {
      taskName,
      duration: durationInSeconds,
    });

    // After a short delay to ensure initialization is complete, start the timer
    setTimeout(() => {
      eventBus.emit('timer:start', { 
        taskName, 
        duration: durationInSeconds,
        currentTime: durationInSeconds
      });
    }, 100);
  }, []);

  return {
    handleTimerStart
  };
};
