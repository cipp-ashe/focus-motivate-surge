
import { useCallback } from 'react';
import { toast } from "sonner";
import { TimerMetrics } from '@/types/metrics';
import { eventBus } from '@/lib/eventBus';

interface UseTimerActionsProps {
  timeLeft: number;
  minutes: number;
  taskName: string;
  updateTimeLeft: (time: number) => void;
  updateMinutes: (minutes: number) => void;
  setIsRunning: (running: boolean) => void;
  updateMetrics: (updates: Partial<TimerMetrics> | ((prev: TimerMetrics) => Partial<TimerMetrics>)) => void;
  metrics: TimerMetrics;
  onDurationChange?: (minutes: number) => void;
}

export const useTimerActions = ({
  timeLeft,
  minutes,
  taskName,
  updateTimeLeft,
  updateMinutes,
  setIsRunning,
  updateMetrics,
  metrics,
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
    eventBus.emit('timer:metrics-update', { 
      taskName,
      metrics: metricUpdates 
    });
    
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [updateMinutes, updateTimeLeft, updateMetrics, onDurationChange, timeLeft, minutes, taskName]);

  const start = useCallback(() => {
    setIsRunning(true);
    const metricUpdates: Partial<TimerMetrics> = {
      startTime: new Date(),
      isPaused: false,
      pausedTimeLeft: null
    };
    updateMetrics(metricUpdates);
    eventBus.emit('timer:start', { taskName, duration: timeLeft });
    eventBus.emit('timer:metrics-update', { 
      taskName,
      metrics: metricUpdates 
    });
    toast.success("Timer started ⏱️🚀");
  }, [setIsRunning, updateMetrics, timeLeft, taskName]);

  const pause = useCallback(() => {
    setIsRunning(false);
    const now = new Date();
    
    updateMetrics((currentMetrics: TimerMetrics) => ({
      lastPauseTimestamp: now,
      isPaused: true,
      pausedTimeLeft: timeLeft,
      pauseCount: (currentMetrics.pauseCount || 0) + 1
    }));
    
    eventBus.emit('timer:pause', { 
      taskName, 
      timeLeft, 
      metrics 
    });
    toast.info("Timer paused ⏸️");
  }, [setIsRunning, updateMetrics, timeLeft, metrics, taskName]);

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
    eventBus.emit('timer:metrics-update', { 
      taskName,
      metrics: metricUpdates 
    });
  }, [minutes, setIsRunning, updateTimeLeft, updateMetrics, taskName]);

  const addTime = useCallback((additionalMinutes: number) => {
    const additionalSeconds = additionalMinutes * 60;
    const newTimeLeft = timeLeft + additionalSeconds;
    const newMinutes = minutes + additionalMinutes;
    
    updateTimeLeft(newTimeLeft);
    updateMinutes(newMinutes);
    
    const metricUpdates: Partial<TimerMetrics> = {
      extensionTime: (metrics.extensionTime || 0) + additionalSeconds,
      expectedTime: newTimeLeft
    };
    
    updateMetrics(metricUpdates);
    eventBus.emit('timer:metrics-update', { 
      taskName,
      metrics: metricUpdates 
    });
    toast.success(`+${additionalMinutes}m added ⌛💪`);
  }, [timeLeft, minutes, updateTimeLeft, updateMinutes, updateMetrics, taskName, metrics]);

  const completeTimer = useCallback(() => {
    const now = new Date();
    const updatedMetrics: TimerMetrics = {
      ...metrics,
      endTime: now,
      actualDuration: metrics.startTime ? 
        Math.floor((now.getTime() - metrics.startTime.getTime()) / 1000) : 0
    };
    updateMetrics(updatedMetrics);
    eventBus.emit('timer:complete', { taskName, metrics: updatedMetrics });
  }, [metrics, updateMetrics, taskName]);

  return {
    setMinutes,
    start,
    pause,
    reset,
    addTime,
    completeTimer,
  };
};
