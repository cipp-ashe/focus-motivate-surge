
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

export const useTimerEvents = () => {
  // Start timer with a task
  const startTimerWithTask = useCallback((taskId: string, taskName: string, duration: number) => {
    eventBus.emit('timer:start', {
      taskId,
      taskName,
      duration 
    });
  }, []);

  // Complete a timer session
  const completeTimerSession = useCallback((taskName: string, timeLeft: number, metrics: any) => {
    eventBus.emit('timer:complete', {
      taskName, 
      timeLeft,
      metrics
    });
  }, []);

  // Cancel a timer session
  const cancelTimerSession = useCallback((taskName: string, duration: number) => {
    eventBus.emit('timer:cancel', {
      taskName,
      duration
    });
  }, []);

  // Pause a timer session
  const pauseTimerSession = useCallback((taskName: string, metrics: any) => {
    eventBus.emit('timer:pause', {
      taskName,
      metrics
    });
  }, []);

  return {
    startTimerWithTask,
    completeTimerSession,
    cancelTimerSession,
    pauseTimerSession
  };
};
