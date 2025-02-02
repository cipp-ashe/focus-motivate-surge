import { useState, useCallback } from 'react';
import { TimerStateMetrics } from '../types/metrics';
import { calculateEfficiencyRatio, determineCompletionStatus, formatTime } from '../utils/timeUtils';

export const useTimerMetrics = (initialDuration: number) => {
  const [metrics, setMetrics] = useState<TimerStateMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    originalDuration: initialDuration,
    actualDuration: 0,
    favoriteQuotes: 0,
    pausedTime: 0,
    lastPauseTimestamp: null,
    extensionTime: 0,
    netEffectiveTime: 0,
    efficiencyRatio: 0,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null,
  });

  const logMetrics = useCallback((metrics: TimerStateMetrics) => {
    console.group('Timer Metrics');
    console.log('Original Duration:', {
      seconds: metrics.originalDuration,
      formatted: formatTime(metrics.originalDuration)
    });
    if (metrics.actualDuration) {
      console.log('Total Elapsed Time:', {
        seconds: metrics.actualDuration,
        formatted: formatTime(metrics.actualDuration)
      });
    }
    console.log('Paused Time:', {
      seconds: metrics.pausedTime,
      formatted: formatTime(metrics.pausedTime)
    });
    if (metrics.netEffectiveTime) {
      console.log('Active Working Time:', {
        seconds: metrics.netEffectiveTime,
        formatted: formatTime(metrics.netEffectiveTime)
      });
    }
    if (metrics.startTime) console.log('Start Time:', metrics.startTime.toISOString());
    if (metrics.endTime) console.log('End Time:', metrics.endTime.toISOString());
    console.groupEnd();
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    setMetrics(prev => {
      // Calculate accumulated pause time if we're updating from a paused state
      let updatedPausedTime = prev.pausedTime;
      if (prev.lastPauseTimestamp && updates.lastPauseTimestamp === null) {
        const pauseDuration = Math.floor(
          (new Date().getTime() - prev.lastPauseTimestamp.getTime()) / 1000
        );
        updatedPausedTime += pauseDuration;
      }

      const newMetrics = {
        ...prev,
        ...updates,
        pausedTime: updatedPausedTime,
      };

      logMetrics(newMetrics);
      return newMetrics;
    });
  }, [logMetrics]);

  const calculateFinalMetrics = useCallback((completionTime: Date) => {
    return new Promise<TimerStateMetrics>((resolve) => {
      setMetrics(prev => {
        if (!prev.startTime) {
          console.warn('No start time found in metrics');
          return prev;
        }

        const totalElapsedMs = completionTime.getTime() - prev.startTime.getTime();
        const finalPausedTime = prev.lastPauseTimestamp
          ? prev.pausedTime + Math.floor((completionTime.getTime() - prev.lastPauseTimestamp.getTime()) / 1000)
          : prev.pausedTime;
        
        const actualWorkingTime = Math.max(0, Math.floor(totalElapsedMs / 1000) - finalPausedTime);
        
        const finalMetrics: TimerStateMetrics = {
          ...prev,
          endTime: completionTime,
          actualDuration: Math.floor(totalElapsedMs / 1000),
          pausedTime: finalPausedTime,
          netEffectiveTime: actualWorkingTime,
          efficiencyRatio: calculateEfficiencyRatio(prev.originalDuration, actualWorkingTime),
          completionStatus: determineCompletionStatus(prev.originalDuration, actualWorkingTime),
          isPaused: false,
          pausedTimeLeft: null,
          lastPauseTimestamp: null,
        };

        logMetrics(finalMetrics);
        resolve(finalMetrics);
        return finalMetrics;
      });
    });
  }, [logMetrics]);

  return {
    metrics,
    updateMetrics,
    calculateFinalMetrics,
  };
};