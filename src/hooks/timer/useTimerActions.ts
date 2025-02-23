
import { useCallback } from 'react';
import { toast } from "sonner";
import { TimerMetrics } from '@/types/metrics';
import { eventBus } from '@/lib/eventBus';

interface UseTimerActionsProps {
  timeLeft: number;
  minutes: number;
  updateTimeLeft: (time: number) => void;
  updateMinutes: (minutes: number) => void;
  setIsRunning: (running: boolean) => void;
  updateMetrics: (updates: Partial<TimerMetrics>) => void;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerActions = ({
  timeLeft,
  minutes,
  updateTimeLeft,
  updateMinutes,
  setIsRunning,
  updateMetrics,
  onDurationChange,
}: UseTimerActionsProps) => {
  const setMinutes = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.max(1, Math.min(60, newMinutes));
    const newSeconds = clampedMinutes * 60;
    
    console.log('Timer Action - Setting minutes:', {
      newMinutes,
      clampedMinutes,
      newSeconds,
      currentTimeLeft: timeLeft,
      currentMinutes: minutes
    });
    
    updateMinutes(clampedMinutes);
    updateTimeLeft(newSeconds);
    
    const metricUpdates: Partial<TimerMetrics> = {
      expectedTime: newSeconds,
      startTime: null,
      endTime: null,
      pauseCount: 0,
      actualDuration: 0,
      isPaused: false,
      pausedTimeLeft: null
    };
    
    updateMetrics(metricUpdates);
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
    
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [updateMinutes, updateTimeLeft, updateMetrics, onDurationChange, timeLeft, minutes]);

  const start = useCallback(() => {
    setIsRunning(true);
    const metricUpdates: Partial<TimerMetrics> = {
      startTime: new Date(),
      isPaused: false,
      pausedTimeLeft: null
    };
    updateMetrics(metricUpdates);
    eventBus.emit('timer:start', { taskName: 'Current Task', duration: timeLeft });
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
    toast.success("Timer started ⏱️🚀");
  }, [setIsRunning, updateMetrics, timeLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
    const now = new Date();
    const metricUpdates: Partial<TimerMetrics> = {
      pauseCount: prev => (prev || 0) + 1,
      lastPauseTimestamp: now,
      isPaused: true,
      pausedTimeLeft: timeLeft // Store the current timeLeft value
    };
    updateMetrics(metricUpdates);
    eventBus.emit('timer:pause', { timeLeft, taskName: 'Current Task' });
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
    toast.info("Timer paused ⏸️");
  }, [setIsRunning, updateMetrics, timeLeft]);

  const reset = useCallback(() => {
    const newSeconds = minutes * 60;
    setIsRunning(false);
    updateTimeLeft(newSeconds);
    
    const metricUpdates: Partial<TimerMetrics> = {
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: newSeconds,
      actualDuration: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: 'Completed On Time',
      isPaused: false,
      pausedTimeLeft: null
    };
    
    updateMetrics(metricUpdates);
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
  }, [minutes, setIsRunning, updateTimeLeft, updateMetrics]);

  const addTime = useCallback((additionalMinutes: number) => {
    const additionalSeconds = additionalMinutes * 60;
    const newTimeLeft = timeLeft + additionalSeconds;
    const newMinutes = minutes + additionalMinutes;
    
    updateTimeLeft(newTimeLeft);
    updateMinutes(newMinutes);
    
    const metricUpdates: Partial<TimerMetrics> = {
      extensionTime: additionalSeconds,
      expectedTime: newTimeLeft
    };
    
    updateMetrics(metricUpdates);
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
    toast.success(`+${additionalMinutes}m added ⌛💪`);
  }, [timeLeft, minutes, updateTimeLeft, updateMinutes, updateMetrics]);

  const completeTimer = useCallback(() => {
    setIsRunning(false);
    const now = new Date();
    const metricUpdates: Partial<TimerMetrics> = {
      endTime: now,
      actualDuration: timeLeft,
      isPaused: false,
      pausedTimeLeft: null,
      completionStatus: 'Completed On Time'
    };
    
    updateMetrics(metricUpdates);
    eventBus.emit('timer:complete', { 
      metrics: {
        startTime: null,
        endTime: now,
        pauseCount: 0,
        expectedTime: minutes * 60,
        actualDuration: timeLeft,
        favoriteQuotes: 0,
        pausedTime: 0,
        lastPauseTimestamp: null,
        extensionTime: 0,
        netEffectiveTime: 0,
        efficiencyRatio: 0,
        completionStatus: 'Completed On Time',
        isPaused: false,
        pausedTimeLeft: null
      },
      taskName: 'Current Task' 
    });
    eventBus.emit('timer:metrics-update', { metrics: metricUpdates });
  }, [setIsRunning, updateMetrics, timeLeft, minutes]);

  return {
    setMinutes,
    start,
    pause,
    reset,
    addTime,
    completeTimer,
  };
};
