
import React from 'react';
import { Card } from '@/components/ui/card';
import { eventManager } from '@/lib/events/EventManager';
import { formatTime } from '@/utils/timeUtils';
import { TimerStateMetrics } from '@/types/metrics';
import { Clock, BarChart } from 'lucide-react';

export interface TimerMetricsProps {
  metrics: TimerStateMetrics;
  taskName: string;
}

export const TimerMetrics: React.FC<TimerMetricsProps> = ({ metrics, taskName }) => {
  // Calculate the effective time (actual working time excluding pauses)
  const calculateEffectiveTime = () => {
    if (!metrics.startTime) return 0;
    
    const startTime = new Date(metrics.startTime);
    const now = new Date();
    const totalElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const pausedTime = metrics.pausedTime || 0;
    
    return Math.max(0, totalElapsed - pausedTime);
  };

  // Update metrics on a timer
  React.useEffect(() => {
    const updateInterval = setInterval(() => {
      // Emit metrics update events with latest data
      if (taskName) {
        const updatedMetrics = {
          ...metrics,
          effectiveTime: calculateEffectiveTime()
        };
        
        eventManager.emit('timer:metrics-update', {
          taskName,
          metrics: updatedMetrics
        });
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, [metrics, taskName]);

  // Format values for display
  const formatValue = (seconds: number) => {
    return formatTime(seconds);
  };

  return (
    <Card className="p-4 my-2 bg-muted/40">
      <h4 className="text-sm font-semibold mb-2 flex items-center">
        <BarChart className="h-4 w-4 mr-1" /> 
        Timer Metrics
      </h4>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Expected:</span>
          <div className="font-mono">{formatValue(metrics.expectedTime)}</div>
        </div>
        
        <div>
          <span className="text-muted-foreground">Effective:</span>
          <div className="font-mono">{formatValue(calculateEffectiveTime())}</div>
        </div>
        
        <div>
          <span className="text-muted-foreground">Paused:</span>
          <div className="font-mono">{formatValue(metrics.pausedTime || 0)}</div>
        </div>

        <div>
          <span className="text-muted-foreground">Started:</span>
          <div className="font-mono">
            {metrics.startTime
              ? new Date(metrics.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Not started'}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Export a separate display component for compact/expanded views
export const TimerMetricsDisplay = TimerMetrics;
