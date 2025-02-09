
import { useCallback } from 'react';
import { toast } from "sonner";
import { TimerMetrics } from '@/types/metrics';

interface UseTimerActionsProps {
  timeLeft: number;
  minutes: number;
  updateTimeLeft: (time: number) => void;
  updateMinutes: (minutes: number) => void;
  updateIsRunning: (running: boolean) => void;
  updateMetrics: ((updates: Partial<TimerMetrics>) => void) & ((updater: (prev: TimerMetrics) => Partial<TimerMetrics>) => void);
  onDurationChange?: (minutes: number) => void;
}

export const useTimerActions = ({
  timeLeft,
  minutes,
  updateTimeLeft,
  updateMinutes,
  updateIsRunning,
  updateMetrics,
  onDurationChange,
}: UseTimerActionsProps) => {
  const setMinutes = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.max(1, Math.min(60, newMinutes));
    const newSeconds = clampedMinutes * 60;
    
    updateMinutes(clampedMinutes);
    updateTimeLeft(newSeconds);
    updateMetrics({
      expectedTime: newSeconds
    });
    
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [updateMinutes, updateTimeLeft, updateMetrics, onDurationChange]);

  const start = useCallback(() => {
    updateIsRunning(true);
    updateMetrics({
      startTime: new Date(),
      isPaused: false,
      pausedTimeLeft: null
    });
    toast.success("Timer started ⏱️🚀");
  }, [updateIsRunning, updateMetrics]);

  const pause = useCallback(() => {
    updateIsRunning(false);
    updateMetrics((prev) => ({
      pauseCount: prev.pauseCount + 1,
      lastPauseTimestamp: new Date(),
      isPaused: true,
      pausedTimeLeft: timeLeft
    }));
  }, [updateIsRunning, updateMetrics, timeLeft]);

  const reset = useCallback(() => {
    const newSeconds = minutes * 60;
    updateIsRunning(false);
    updateTimeLeft(newSeconds);
    updateMetrics({
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
    });
  }, [minutes, updateIsRunning, updateTimeLeft, updateMetrics]);

  const addTime = useCallback((additionalMinutes: number) => {
    const additionalSeconds = additionalMinutes * 60;
    updateTimeLeft(timeLeft + additionalSeconds);
    updateMinutes(minutes + additionalMinutes);
    updateMetrics((prev) => ({
      extensionTime: prev.extensionTime + additionalSeconds,
      expectedTime: prev.expectedTime + additionalSeconds
    }));
    toast.success(`+${additionalMinutes}m added ⌛💪`);
  }, [timeLeft, minutes, updateTimeLeft, updateMinutes, updateMetrics]);

  const completeTimer = useCallback(() => {
    updateIsRunning(false);
    updateMetrics((prev) => ({
      endTime: new Date(),
      actualDuration: prev.startTime 
        ? Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
        : prev.actualDuration,
      isPaused: false,
      pausedTimeLeft: null
    }));
  }, [updateIsRunning, updateMetrics]);

  return {
    setMinutes,
    start,
    pause,
    reset,
    addTime,
    completeTimer,
  };
};
