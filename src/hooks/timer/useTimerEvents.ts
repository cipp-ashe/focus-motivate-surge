
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

/**
 * Hook to handle timer events through the event bus system
 */
export const useTimerEvents = () => {
  const handleTimerInit = useCallback((taskName: string, duration: number) => {
    console.log('Initializing timer via event bus:', { taskName, duration });
    eventBus.emit('timer:init', { taskName, duration });
  }, []);

  const handleTimerStart = useCallback((taskName: string, duration: number) => {
    console.log('Starting timer via event bus:', { taskName, duration });
    
    // First initialize the timer
    eventBus.emit('timer:init', { taskName, duration });
    
    // Then start it after a short delay to ensure proper initialization
    setTimeout(() => {
      eventBus.emit('timer:start', { taskName, duration });
    }, 50);
  }, []);

  const handleTimerPause = useCallback((taskName: string, timeLeft: number, metrics: any) => {
    console.log('Pausing timer via event bus');
    eventBus.emit('timer:pause', { taskName, timeLeft, metrics });
  }, []);

  const handleTimerReset = useCallback((taskName: string, duration: number) => {
    console.log('Resetting timer via event bus');
    eventBus.emit('timer:reset', { taskName, duration });
  }, []);

  const handleTimerComplete = useCallback((taskName: string, metrics: any) => {
    console.log('Completing timer via event bus with metrics:', metrics);
    eventBus.emit('timer:complete', { taskName, metrics });
  }, []);

  const handleTimerExpand = useCallback((taskName: string) => {
    console.log('Expanding timer via event bus for task:', taskName);
    eventBus.emit('timer:expand', { taskName });
  }, []);

  const handleTimerCollapse = useCallback((taskName: string, saveNotes: boolean) => {
    console.log('Collapsing timer via event bus for task:', taskName, 'save notes:', saveNotes);
    eventBus.emit('timer:collapse', { taskName, saveNotes });
  }, []);

  return {
    handleTimerInit,
    handleTimerStart,
    handleTimerPause,
    handleTimerReset,
    handleTimerComplete,
    handleTimerExpand,
    handleTimerCollapse
  };
};
