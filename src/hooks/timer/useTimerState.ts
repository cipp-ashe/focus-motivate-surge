
import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { SoundOption } from '@/types/timer';
import { toast } from "sonner";
import { calculateEfficiencyRatio, determineCompletionStatus } from '@/utils/timeUtils';

export const useTimerState = (initialDuration: number) => {
  // Core timer state
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [minutes, setMinutesState] = useState(Math.floor(initialDuration / 60));
  const [isRunning, setIsRunning] = useState(false);
  
  // UI state
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>("bell");
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Metrics state
  const [metrics, setMetrics] = useState<TimerStateMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: initialDuration,
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

  const isMountedRef = useRef(true);
  const metricsRef = useRef(metrics);
  const pauseTimerRef = useRef<NodeJS.Timeout>();

  // Update refs
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  const updateTimeLeft = useCallback((newTimeLeft: number | ((prev: number) => number)) => {
    if (!isMountedRef.current) return;
    setTimeLeft(prev => {
      const next = typeof newTimeLeft === 'function' ? newTimeLeft(prev) : newTimeLeft;
      return Math.max(0, Math.min(next, minutes * 60));
    });
  }, [minutes]);

  const updateMinutes = useCallback((newMinutes: number) => {
    if (!isMountedRef.current) return;
    const clampedMinutes = Math.max(1, Math.min(60, newMinutes));
    setMinutesState(clampedMinutes);
    updateTimeLeft(clampedMinutes * 60);
  }, [updateTimeLeft]);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics> | ((prev: TimerStateMetrics) => Partial<TimerStateMetrics>)) => {
    if (!isMountedRef.current) return;
    
    setMetrics(prev => {
      const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
      
      let updatedPausedTime = prev.pausedTime;
      if (prev.lastPauseTimestamp && newUpdates.lastPauseTimestamp === null) {
        const pauseDuration = Math.floor(
          (new Date().getTime() - prev.lastPauseTimestamp.getTime()) / 1000
        );
        updatedPausedTime += pauseDuration;
      }

      const nextMetrics = {
        ...prev,
        ...newUpdates,
        pausedTime: newUpdates.pausedTime !== undefined ? newUpdates.pausedTime : updatedPausedTime,
      };

      // Calculate derived metrics
      if (nextMetrics.startTime && nextMetrics.endTime) {
        const totalElapsedMs = nextMetrics.endTime.getTime() - nextMetrics.startTime.getTime();
        const totalElapsedSeconds = Math.floor(totalElapsedMs / 1000);
        const actualWorkingTime = Math.max(0, totalElapsedSeconds - nextMetrics.pausedTime);
        const netEffectiveTime = actualWorkingTime + nextMetrics.extensionTime;
        
        nextMetrics.actualDuration = totalElapsedSeconds;
        nextMetrics.netEffectiveTime = netEffectiveTime;
        nextMetrics.efficiencyRatio = calculateEfficiencyRatio(nextMetrics.expectedTime, actualWorkingTime);
        nextMetrics.completionStatus = determineCompletionStatus(nextMetrics.expectedTime, actualWorkingTime);
      }

      return nextMetrics;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  return {
    // Core timer state
    timeLeft,
    minutes,
    isRunning,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    
    // UI state
    isExpanded,
    setIsExpanded,
    selectedSound,
    setSelectedSound,
    showCompletion,
    setShowCompletion,
    showConfirmation,
    setShowConfirmation,
    
    // Metrics state
    metrics,
    updateMetrics,
    
    // Refs
    isMountedRef,
    pauseTimerRef,
  };
};
