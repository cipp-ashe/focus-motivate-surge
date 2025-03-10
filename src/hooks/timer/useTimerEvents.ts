
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

export const useTimerEvents = () => {
  // Start timer with a task
  const startTimerWithTask = useCallback((taskId: string, taskName: string, duration: number) => {
    eventManager.emit('timer:start', {
      taskName,
      duration
    });
  }, []);

  // Complete a timer session
  const completeTimerSession = useCallback((taskName: string, timeLeft: number, metrics: any) => {
    eventManager.emit('timer:complete', {
      taskName, 
      metrics
    });
  }, []);

  // Cancel a timer session
  const cancelTimerSession = useCallback((taskName: string, duration: number) => {
    // We need to use 'as any' here since 'timer:reset' is what we need to use instead of 'timer:cancel'
    eventManager.emit('timer:reset' as any, {
      taskName,
      duration
    });
  }, []);

  // Pause a timer session
  const pauseTimerSession = useCallback((taskName: string, timeLeft: number, metrics: any) => {
    eventManager.emit('timer:pause', {
      taskName,
      timeLeft,
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
