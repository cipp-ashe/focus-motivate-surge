
import { useEffect } from 'react';
import { useErrorBoundary } from './useErrorBoundary';
import { toast } from 'sonner';
import type { TimerStateMetrics } from '@/types/metrics';

interface TimerMonitorProps {
  timeLeft: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  componentName: string;
}

export const useTimerMonitor = ({
  timeLeft,
  isRunning,
  metrics,
  componentName
}: TimerMonitorProps) => {
  const { error } = useErrorBoundary(componentName);

  // Monitor time left
  useEffect(() => {
    if (timeLeft < 0) {
      toast.error('Timer reached invalid state', {
        description: 'Time value cannot be negative'
      });
    }
  }, [timeLeft]);

  // Monitor running state and metrics
  useEffect(() => {
    if (isRunning && metrics.pauseCount > 10) {
      toast.warning('High number of pauses detected', {
        description: 'Consider taking a longer break'
      });
    }
  }, [isRunning, metrics]);

  // Monitor performance issues
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        if (fps < 30 && isRunning) {
          console.warn(`[${componentName}] Performance warning:`, {
            fps,
            timeLeft,
            isRunning,
            metrics
          });
          
          toast.warning('Performance issues detected', {
            description: 'Timer might not be accurate'
          });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      frameId = requestAnimationFrame(checkPerformance);
    };

    frameId = requestAnimationFrame(checkPerformance);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [componentName, isRunning, timeLeft, metrics]);

  // Log interaction patterns
  useEffect(() => {
    const logInteraction = () => {
      console.log(`[${componentName}] User interaction detected:`, {
        timeLeft,
        isRunning,
        metrics,
        timestamp: new Date().toISOString()
      });
    };

    document.addEventListener('click', logInteraction);
    document.addEventListener('keypress', logInteraction);

    return () => {
      document.removeEventListener('click', logInteraction);
      document.removeEventListener('keypress', logInteraction);
    };
  }, [componentName, timeLeft, isRunning, metrics]);

  // Handle errors from error boundary
  useEffect(() => {
    if (error) {
      console.error(`[${componentName}] Error detected in timer:`, error);
    }
  }, [error, componentName]);
};

