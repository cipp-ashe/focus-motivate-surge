
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook for managing timer-related events
 */
export const useTimerEvents = () => {
  // Start timer with a task
  const startTimerWithTask = useCallback((taskId: string, taskName: string, duration: number) => {
    eventManager.emit('timer:start', {
      taskId,
      taskName,
      duration
    });
  }, []);

  // Complete a timer session
  const completeTimerSession = useCallback((taskId: string, taskName: string, metrics: any) => {
    eventManager.emit('timer:complete', {
      taskId,
      taskName, 
      metrics
    });
  }, []);

  // Cancel a timer session
  const cancelTimerSession = useCallback((taskId: string, taskName: string) => {
    eventManager.emit('timer:reset', {
      taskId,
      taskName
    });
  }, []);

  // Pause a timer session
  const pauseTimerSession = useCallback((taskId: string, taskName: string, timeLeft: number) => {
    eventManager.emit('timer:pause', {
      taskId,
      taskName,
      timeLeft
    });
  }, []);

  // Resume a timer session
  const resumeTimerSession = useCallback((taskId: string, taskName: string, timeLeft: number) => {
    eventManager.emit('timer:resume', {
      taskId,
      taskName,
      timeLeft
    });
  }, []);

  // Expand the timer view
  const expandTimer = useCallback((taskName: string) => {
    eventManager.emit('timer:expand', {
      taskName
    });
  }, []);

  // Collapse the timer view
  const collapseTimer = useCallback((taskName: string, saveNotes: boolean = false) => {
    eventManager.emit('timer:collapse', {
      taskName,
      saveNotes
    });
  }, []);

  // Update timer metrics
  const updateTimerMetrics = useCallback((taskId: string, metrics: any, taskName?: string) => {
    eventManager.emit('timer:update-metrics', {
      taskId,
      metrics,
      taskName
    });
  }, []);

  return {
    startTimerWithTask,
    completeTimerSession,
    cancelTimerSession,
    pauseTimerSession,
    resumeTimerSession,
    expandTimer,
    collapseTimer,
    updateTimerMetrics
  };
};
