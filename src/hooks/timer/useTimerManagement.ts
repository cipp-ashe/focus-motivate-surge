
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Unified hook for timer management and events
 */
export const useTimerManagement = () => {
  // Start timer with a task
  const startTimer = useCallback((taskId: string, taskName: string, duration: number) => {
    eventManager.emit('timer:start', {
      taskId,
      taskName,
      duration
    });
  }, []);

  // Complete a timer session
  const completeTimer = useCallback((taskId: string, taskName: string, metrics: any) => {
    eventManager.emit('timer:complete', {
      taskId,
      taskName, 
      metrics
    });
  }, []);

  // Cancel a timer session
  const cancelTimer = useCallback((taskId: string, taskName: string) => {
    eventManager.emit('timer:reset', {
      taskId,
      taskName
    });
  }, []);

  // Pause a timer session
  const pauseTimer = useCallback((taskId: string, taskName: string, timeLeft: number) => {
    eventManager.emit('timer:pause', {
      taskId,
      taskName,
      timeLeft
    });
  }, []);

  // Resume a timer session
  const resumeTimer = useCallback((taskId: string, taskName: string, timeLeft: number) => {
    eventManager.emit('timer:resume', {
      taskId,
      taskName,
      timeLeft
    });
  }, []);

  // Set task for timer
  const setTimerTask = useCallback((taskId: string, taskName: string, duration: number) => {
    eventManager.emit('timer:set-task', {
      id: taskId,
      name: taskName,
      duration,
      taskId,
      completed: false, 
      createdAt: new Date().toISOString()
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
    startTimer,
    completeTimer,
    cancelTimer,
    pauseTimer,
    resumeTimer,
    setTimerTask,
    expandTimer,
    collapseTimer,
    updateTimerMetrics
  };
};
