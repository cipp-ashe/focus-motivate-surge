
import { useEffect } from 'react';
import { useStateMonitor } from './useStateMonitor';
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
  useStateMonitor({
    value: timeLeft,
    name: 'timeLeft',
    validate: (value) => value >= 0,
    onInvalid: () => {
      toast.error('Timer reached invalid state', {
        description: 'Time value cannot be negative'
      });
    },
    component: componentName
  });

  // Monitor running state and metrics
  useStateMonitor({
    value: { isRunning, metrics },
    name: 'timerState',
    validate: (state) => {
      if (state.isRunning && state.metrics.totalPauses > 10) {
        toast.warning('High number of pauses detected', {
          description: 'Consider taking a longer break'
        });
        return false;
      }
      return true;
    },
    component: componentName
  });

  // Monitor performance issues
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) { // Check every second
        const fps = frameCount;
        if (fps < 30 && isRunning) { // Alert on low FPS while timer is running
          console.warn(`[${componentName}] Performance warning:`, {
            fps,
            timeLeft,
            isRunning
          });
          
          toast.warning('Performance issues detected', {
            description: 'Timer might not be accurate'
          });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(checkPerformance);
    };

    const frameId = requestAnimationFrame(checkPerformance);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [componentName, isRunning, timeLeft]);

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
