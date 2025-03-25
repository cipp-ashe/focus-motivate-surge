
import { useCallback } from 'react';
import { useTimerMetrics } from '@/hooks/timer/useTimerMetrics';

export const useTimerComplete = (
  metrics: any, 
  updateMetrics: (updates: any) => void,
  onTimerDone: () => void
) => {
  const { saveCompletionMetrics } = useTimerMetrics();

  const completeTimer = useCallback(() => {
    console.log("Timer completed");
    
    // Mark timer as completed in metrics
    updateMetrics({
      endTime: new Date().toISOString(),
      completionStatus: 'completed'
    });
    
    // Save metrics to storage
    saveCompletionMetrics(metrics, 'completed');
    
    // Execute any additional completion actions
    onTimerDone();
  }, [metrics, updateMetrics, saveCompletionMetrics, onTimerDone]);

  const abandonTimer = useCallback(() => {
    console.log("Timer abandoned");
    
    // Mark timer as abandoned in metrics
    updateMetrics({
      endTime: new Date().toISOString(),
      completionStatus: 'abandoned'
    });
    
    // Save metrics to storage
    saveCompletionMetrics(metrics, 'abandoned');
  }, [metrics, updateMetrics, saveCompletionMetrics]);

  return {
    completeTimer,
    abandonTimer
  };
};
