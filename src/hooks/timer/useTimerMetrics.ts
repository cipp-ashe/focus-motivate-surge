
import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerStateMetrics } from '@/types/metrics';
import { 
  calculateEfficiencyRatio, 
  determineCompletionStatus, 
  formatTimeDisplay 
} from '@/lib/utils/formatters';

export const useTimerMetrics = (initialDurationSeconds: number) => {
  const [metrics, setMetrics] = useState<TimerStateMetrics>({
    startTime: null,
    endTime: null,
    pauseCount: 0,
    expectedTime: initialDurationSeconds,
    actualDuration: 0,
    favoriteQuotes: [] as string[],
    pausedTime: 0,
    lastPauseTimestamp: null,
    extensionTime: 0,
    netEffectiveTime: 0,
    efficiencyRatio: 0,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null,
  });

  const isMountedRef = useRef(true);
  const metricsRef = useRef(metrics);

  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  const logMetrics = useCallback((metrics: TimerStateMetrics) => {
    if (!isMountedRef.current) return;

    console.group('Timer Metrics');
    console.log('Expected Time:', {
      seconds: metrics.expectedTime,
      formatted: formatTimeDisplay(metrics.expectedTime)
    });
    if (metrics.actualDuration) {
      console.log('Total Elapsed Time:', {
        seconds: metrics.actualDuration,
        formatted: formatTimeDisplay(metrics.actualDuration)
      });
    }
    console.log('Paused Time:', {
      seconds: metrics.pausedTime,
      formatted: formatTimeDisplay(metrics.pausedTime)
    });
    if (metrics.netEffectiveTime) {
      console.log('Active Working Time:', {
        seconds: metrics.netEffectiveTime,
        formatted: formatTimeDisplay(metrics.netEffectiveTime)
      });
    }
    if (metrics.startTime) console.log('Start Time:', metrics.startTime.toISOString());
    if (metrics.endTime) console.log('End Time:', metrics.endTime.toISOString());
    console.groupEnd();
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    if (!isMountedRef.current) return;

    setMetrics(prev => {
      let updatedPausedTime = prev.pausedTime;
      if (prev.lastPauseTimestamp && updates.lastPauseTimestamp === null) {
        const now = new Date();
        const pauseDuration = Math.floor(
          (now.getTime() - prev.lastPauseTimestamp.getTime()) / 1000
        );
        updatedPausedTime += pauseDuration;
      }

      const newMetrics = {
        ...prev,
        ...updates,
        pausedTime: updates.pausedTime !== undefined ? updates.pausedTime : updatedPausedTime,
      };

      logMetrics(newMetrics);
      return newMetrics;
    });
  }, [logMetrics]);

  const calculateFinalMetrics = useCallback((completionTime: Date) => {
    return new Promise<TimerStateMetrics>((resolve) => {
      if (!isMountedRef.current) {
        resolve(metricsRef.current);
        return;
      }

      setMetrics(prev => {
        if (!prev.startTime) {
          console.warn('No start time found in metrics');
          return prev;
        }

        const totalElapsedMs = completionTime.getTime() - prev.startTime.getTime();
        const finalPausedTime = prev.lastPauseTimestamp
          ? prev.pausedTime + Math.floor((completionTime.getTime() - prev.lastPauseTimestamp.getTime()) / 1000)
          : prev.pausedTime;
        
        const totalElapsedSeconds = Math.floor(totalElapsedMs / 1000);
        const actualWorkingTime = Math.max(0, totalElapsedSeconds - finalPausedTime);
        const netEffectiveTime = actualWorkingTime + prev.extensionTime;
        
        const efficiencyRatio = calculateEfficiencyRatio(prev.expectedTime, netEffectiveTime);
        const completionStatus = determineCompletionStatus(prev.expectedTime, netEffectiveTime);
        
        const finalMetrics: TimerStateMetrics = {
          ...prev,
          endTime: completionTime,
          actualDuration: totalElapsedSeconds,
          pausedTime: finalPausedTime,
          netEffectiveTime: netEffectiveTime,
          efficiencyRatio: efficiencyRatio,
          completionStatus: completionStatus,
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

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    metrics,
    updateMetrics,
    calculateFinalMetrics,
  };
};
