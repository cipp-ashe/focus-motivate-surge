
import { TimerMetrics } from "@/types/metrics";
import { Clock, Pause, Quote, Zap, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useEventBus } from "@/lib/eventBus";

interface TimerMetricsDisplayProps {
  metrics: TimerMetrics;
  isRunning: boolean;
}

const formatTime = (seconds: number): string => {
  if (seconds === 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${remainingSeconds}s`;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
};

const getEfficiencyColor = (ratio: number): string => {
  if (ratio >= 90) return "text-green-500";
  if (ratio >= 70) return "text-yellow-500";
  return "text-red-500";
};

export const TimerMetricsDisplay = ({ metrics, isRunning }: TimerMetricsDisplayProps) => {
  // Subscribe to timer events
  useEventBus('timer:metrics-update', (updatedMetrics: TimerMetrics) => {
    console.log('Timer metrics updated:', updatedMetrics);
  }, []);

  useEffect(() => {
    console.log('TimerMetrics rendered with:', {
      isRunning,
      metrics,
      efficiencyRatio: metrics?.efficiencyRatio,
      netEffectiveTime: metrics?.netEffectiveTime,
      expectedTime: metrics?.expectedTime
    });
  }, [isRunning, metrics]);

  if (!metrics) return null;

  const efficiencyClass = getEfficiencyColor(metrics.efficiencyRatio || 0);
  const progressValue = metrics.netEffectiveTime 
    ? (metrics.netEffectiveTime / metrics.expectedTime) * 100
    : 0;

  return (
    <div className="text-sm text-muted-foreground space-y-3 pt-2">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>
          {metrics.extensionTime > 0 && (
            <span className="text-primary">
              +{formatTime(metrics.extensionTime)} added •{" "}
            </span>
          )}
          {formatTime(metrics.pausedTime)} paused
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Pause className="h-4 w-4" />
        <span>
          {metrics.pauseCount} {metrics.pauseCount === 1 ? 'break' : 'breaks'} taken
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <span className={efficiencyClass}>
          {Math.round(metrics.efficiencyRatio || 0)}% efficiency
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Progress</span>
        </div>
        <Progress value={progressValue} className="h-1.5" />
      </div>
      
      {metrics.favoriteQuotes > 0 && (
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4" />
          <span>{metrics.favoriteQuotes} quotes saved</span>
        </div>
      )}
    </div>
  );
};

