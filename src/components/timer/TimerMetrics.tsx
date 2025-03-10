
import { TimerMetrics } from "@/types/metrics";
import { Clock, Pause, Quote, Zap, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useEventBus } from "@/hooks/useEventBus";
import { cn } from "@/lib/utils";

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
  const [localMetrics, setLocalMetrics] = useState<TimerMetrics>(metrics);

  useEventBus('timer:metrics-update', ({ metrics: updatedMetrics }) => {
    console.log('Timer metrics updated:', updatedMetrics);
    setLocalMetrics(prev => ({
      ...prev,
      ...updatedMetrics
    }));
  }, []);

  useEffect(() => {
    setLocalMetrics(metrics);
  }, [metrics]);

  // Only show metrics if timer has been started (startTime exists) or is paused
  if (!localMetrics?.startTime && !localMetrics?.isPaused) return null;

  const efficiencyClass = getEfficiencyColor(localMetrics.efficiencyRatio || 0);
  const progressValue = localMetrics.netEffectiveTime 
    ? (localMetrics.netEffectiveTime / localMetrics.expectedTime) * 100
    : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Time Information */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
          <div className={cn(
            "p-2.5 rounded-full transition-colors",
            isRunning ? "bg-primary/10" : "bg-muted"
          )}>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-medium text-sm">
              {metrics.extensionTime > 0 && (
                <span className="text-primary">
                  +{formatTime(metrics.extensionTime)} added
                </span>
              )}
            </span>
            <span className="text-muted-foreground text-sm">
              {formatTime(metrics.pausedTime)} paused
            </span>
          </div>
        </div>
        
        {/* Break Count */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
          <div className={cn(
            "p-2.5 rounded-full transition-colors",
            isRunning ? "bg-primary/10" : "bg-muted"
          )}>
            <Pause className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground text-sm">
            {metrics.pauseCount} {metrics.pauseCount === 1 ? 'break' : 'breaks'} taken
          </span>
        </div>
      </div>
      
      {/* Efficiency Status */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
        <div className={cn(
          "p-2.5 rounded-full transition-colors",
          isRunning ? "bg-primary/10" : "bg-muted"
        )}>
          <Zap className={cn("h-4 w-4", efficiencyClass)} />
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-semibold text-sm transition-colors",
            efficiencyClass
          )}>
            {Math.round(metrics.efficiencyRatio || 0)}% efficiency
          </span>
          <span className="text-xs text-muted-foreground">
            {metrics.efficiencyRatio >= 90 ? "Excellent pace!" : 
             metrics.efficiencyRatio >= 70 ? "Good progress" : 
             "Room for improvement"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3 p-3 rounded-lg bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-full transition-colors",
              isRunning ? "bg-primary/10" : "bg-muted"
            )}>
              <BarChart className="h-4 w-4 text-primary" />
            </div>
            <span className="text-foreground text-sm">Progress</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(progressValue)}%
          </span>
        </div>
        <Progress 
          value={progressValue} 
          className={cn(
            "h-2 transition-all duration-300",
            isRunning && "bg-primary/20"
          )} 
        />
      </div>
      
      {/* Quotes Counter */}
      {metrics.favoriteQuotes > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
          <div className={cn(
            "p-2.5 rounded-full transition-colors",
            isRunning ? "bg-primary/10" : "bg-muted"
          )}>
            <Quote className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-sm">
              {metrics.favoriteQuotes} quote{metrics.favoriteQuotes !== 1 ? 's' : ''} saved
            </span>
            <span className="text-xs text-muted-foreground">
              Keep collecting inspiration!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
