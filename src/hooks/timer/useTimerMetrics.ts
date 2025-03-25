
import { useCallback, useEffect } from 'react';
import { TimerStateMetrics } from '@/types/metrics';

const TIMER_METRICS_STORAGE_KEY = 'timer-metrics';

export const useTimerMetricsStorage = () => {
  // Load metrics from storage
  const loadMetrics = useCallback((): TimerStateMetrics[] => {
    try {
      const storedMetrics = localStorage.getItem(TIMER_METRICS_STORAGE_KEY);
      if (storedMetrics) {
        return JSON.parse(storedMetrics);
      }
    } catch (error) {
      console.error('Failed to load timer metrics:', error);
    }
    return [];
  }, []);

  // Save metrics to storage
  const saveMetrics = useCallback((metrics: TimerStateMetrics) => {
    try {
      console.log('Saving timer metrics:', metrics);
      const currentMetrics = loadMetrics();
      const updatedMetrics = [...currentMetrics, metrics];
      
      localStorage.setItem(TIMER_METRICS_STORAGE_KEY, JSON.stringify(updatedMetrics));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('metrics-updated'));
      
      return true;
    } catch (error) {
      console.error('Failed to save timer metrics:', error);
      return false;
    }
  }, [loadMetrics]);

  // Update an existing metric
  const updateMetric = useCallback((index: number, updates: Partial<TimerStateMetrics>) => {
    try {
      const currentMetrics = loadMetrics();
      if (index >= 0 && index < currentMetrics.length) {
        currentMetrics[index] = { ...currentMetrics[index], ...updates };
        localStorage.setItem(TIMER_METRICS_STORAGE_KEY, JSON.stringify(currentMetrics));
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('metrics-updated'));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update timer metric:', error);
      return false;
    }
  }, [loadMetrics]);

  return {
    loadMetrics,
    saveMetrics,
    updateMetric
  };
};

export const useTimerMetrics = (initialMetrics?: Partial<TimerStateMetrics>) => {
  const { saveMetrics, loadMetrics } = useTimerMetricsStorage();
  
  // Initialize metrics with current timestamp
  const initializeMetrics = useCallback((): TimerStateMetrics => {
    return {
      startTime: new Date().toISOString(),
      endTime: null,
      completionDate: null,
      actualDuration: 0,
      pausedTime: 0,
      extensionTime: 0,
      netEffectiveTime: 0,
      completionStatus: null,
      isPaused: false,
      pausedTimeLeft: null,
      expectedTime: 0,
      pauseCount: 0,
      lastPauseTimestamp: null,
      favoriteQuotes: [],
      efficiencyRatio: 0,
      ...initialMetrics
    };
  }, [initialMetrics]);

  // Calculate metrics when timer completes
  const calculateCompletionMetrics = useCallback(
    (metrics: TimerStateMetrics, status: 'completed' | 'abandoned' | 'extended'): TimerStateMetrics => {
      const now = new Date().toISOString();
      const endTime = metrics.endTime || now;
      const startTimestamp = metrics.startTime ? new Date(metrics.startTime).getTime() : 0;
      const endTimestamp = new Date(endTime).getTime();
      
      // Calculate actual duration (in seconds)
      const actualDuration = Math.round((endTimestamp - startTimestamp) / 1000);
      
      // Calculate net effective time (actual duration minus paused time)
      const netEffectiveTime = Math.max(0, actualDuration - (metrics.pausedTime || 0));
      
      // Calculate efficiency ratio (if expected time is available)
      let efficiencyRatio = 0;
      if (metrics.expectedTime && metrics.expectedTime > 0) {
        efficiencyRatio = Math.min(1, metrics.expectedTime / netEffectiveTime);
      }
      
      return {
        ...metrics,
        endTime,
        completionDate: now,
        actualDuration,
        netEffectiveTime,
        efficiencyRatio,
        completionStatus: status
      };
    },
    []
  );

  // Save completion metrics
  const saveCompletionMetrics = useCallback(
    (metrics: TimerStateMetrics, status: 'completed' | 'abandoned' | 'extended') => {
      const completedMetrics = calculateCompletionMetrics(metrics, status);
      return saveMetrics(completedMetrics);
    },
    [calculateCompletionMetrics, saveMetrics]
  );

  return {
    initializeMetrics,
    calculateCompletionMetrics,
    saveCompletionMetrics,
    loadMetrics
  };
};
