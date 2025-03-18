
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
    if (metrics.startTime) {
      const startTimeStr = typeof metrics.startTime === 'string' 
        ? metrics.startTime 
        : metrics.startTime.toISOString();
      console.log('Start Time:', startTimeStr);
    }
    if (metrics.endTime) {
      const endTimeStr = typeof metrics.endTime === 'string' 
        ? metrics.endTime 
        : metrics.endTime.toISOString();
      console.log('End Time:', endTimeStr);
    }
    console.groupEnd();
  }, []);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    if (!isMountedRef.current) return;

    setMetrics(prev => {
      let updatedPausedTime = prev.pausedTime;
      if (prev.lastPauseTimestamp && updates.lastPauseTimestamp === null) {
        const now = new Date();
        const pauseTimestamp = typeof prev.lastPauseTimestamp === 'string' 
          ? new Date(prev.lastPauseTimestamp) 
          : prev.lastPauseTimestamp;
        
        const pauseDuration = Math.floor(
          (now.getTime() - pauseTimestamp.getTime()) / 1000
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

        const startTime = typeof prev.startTime === 'string' 
          ? new Date(prev.startTime) 
          : prev.startTime;
        
        const totalElapsedMs = completionTime.getTime() - startTime.getTime();
        
        let finalPausedTime = prev.pausedTime;
        if (prev.lastPauseTimestamp) {
          const pauseTimestamp = typeof prev.lastPauseTimestamp === 'string' 
            ? new Date(prev.lastPauseTimestamp) 
            : prev.lastPauseTimestamp;
          
          finalPausedTime += Math.floor(
            (completionTime.getTime() - pauseTimestamp.getTime()) / 1000
          );
        }
        
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
