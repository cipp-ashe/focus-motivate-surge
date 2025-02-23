
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

export const useTimerEvents = () => {
  const handleTimerStart = useCallback((taskName: string, duration: number) => {
    console.log('Timer event - Task selected:', { taskName, duration });
    
    // Just initialize the timer without starting it
    eventBus.emit('timer:init', {
      taskName,
      duration,
    });
  }, []);

  return {
    handleTimerStart
  };
};
