
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

  const handleTimerPause = useCallback(() => {
    console.log('Pausing timer via event bus');
    eventBus.emit('timer:pause', {});
  }, []);

  const handleTimerReset = useCallback(() => {
    console.log('Resetting timer via event bus');
    eventBus.emit('timer:reset', {});
  }, []);

  const handleTimerComplete = useCallback((metrics: any) => {
    console.log('Completing timer via event bus with metrics:', metrics);
    eventBus.emit('timer:complete', { metrics });
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
