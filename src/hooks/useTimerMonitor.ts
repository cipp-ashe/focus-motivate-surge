
import { useEffect } from 'react';
import { useStateMonitor } from './useStateMonitor';
import { toast } from 'sonner';

interface TimerMonitorProps {
  timeLeft: number;
  isRunning: boolean;
  metrics: any; // Type this according to your metrics interface
  componentName: string;
}

export const useTimerMonitor = ({
  timeLeft,
  isRunning,
  metrics,
  componentName
}: TimerMonitorProps) => {
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
    component: componentName
  });

  // Monitor for potential memory leaks
  useEffect(() => {
    const interval = setInterval(() => {
      const heapUsed = performance.memory?.usedJSHeapSize;
      if (heapUsed && heapUsed > 100 * 1024 * 1024) { // Alert if heap size > 100MB
        console.warn(`[${componentName}] High memory usage detected:`, {
          heapUsed: `${Math.round(heapUsed / (1024 * 1024))}MB`
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [componentName]);
};
