
import { TimerMetrics } from "@/types/metrics";
import { Clock, Pause, Quote, Zap, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useEventBus } from "@/lib/eventBus";
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
  useEventBus('timer:metrics-update', ({ metrics: updatedMetrics }) => {
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

  // Only show metrics if timer has been started (startTime exists) or is paused
  if (!metrics?.startTime && !metrics?.isPaused) return null;

  const efficiencyClass = getEfficiencyColor(metrics.efficiencyRatio || 0);
  const progressValue = metrics.netEffectiveTime 
    ? (metrics.netEffectiveTime / metrics.expectedTime) * 100
    : 0;

  return (
    <div className={cn(
      "text-sm space-y-4 transition-all duration-300",
      "sm:pt-3 sm:rounded-lg",
      "pt-2 px-2 sm:px-4",
      "max-h-[calc(100vh-24rem)] overflow-y-auto scrollbar-none",
      isRunning ? "bg-card/5" : ""
    )}>
      {/* Time Information */}
      <div className="flex items-center gap-2 sm:gap-3 transition-all duration-300">
        <div className={cn(
          "p-1.5 sm:p-2 rounded-full transition-colors",
          isRunning ? "bg-primary/10" : "bg-muted"
        )}>
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground font-medium text-xs sm:text-sm">
            {metrics.extensionTime > 0 && (
              <span className="text-primary">
                +{formatTime(metrics.extensionTime)} added
              </span>
            )}
          </span>
          <span className="text-muted-foreground text-xs sm:text-sm">
            {formatTime(metrics.pausedTime)} paused
          </span>
        </div>
      </div>
      
      {/* Break Count */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={cn(
          "p-1.5 sm:p-2 rounded-full transition-colors",
          isRunning ? "bg-primary/10" : "bg-muted"
        )}>
          <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
        <span className="text-foreground text-xs sm:text-sm">
          {metrics.pauseCount} {metrics.pauseCount === 1 ? 'break' : 'breaks'} taken
        </span>
      </div>
      
      {/* Efficiency Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={cn(
          "p-1.5 sm:p-2 rounded-full transition-colors",
          isRunning ? "bg-primary/10" : "bg-muted"
        )}>
          <Zap className={cn("h-3 w-3 sm:h-4 sm:w-4", efficiencyClass)} />
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-semibold text-xs sm:text-sm transition-colors",
            efficiencyClass
          )}>
            {Math.round(metrics.efficiencyRatio || 0)}% efficiency
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {metrics.efficiencyRatio >= 90 ? "Excellent pace!" : 
             metrics.efficiencyRatio >= 70 ? "Good progress" : 
             "Room for improvement"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            "p-1.5 sm:p-2 rounded-full transition-colors",
            isRunning ? "bg-primary/10" : "bg-muted"
          )}>
            <BarChart className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </div>
          <span className="text-foreground text-xs sm:text-sm">Progress</span>
        </div>
        <div className="relative">
          <Progress 
            value={progressValue} 
            className={cn(
              "h-1.5 sm:h-2 transition-all duration-300",
              isRunning && "bg-primary/20"
            )} 
          />
          <span className="absolute right-0 -top-4 text-[10px] sm:text-xs text-muted-foreground">
            {Math.round(progressValue)}%
          </span>
        </div>
      </div>
      
      {/* Quotes Counter */}
      {metrics.favoriteQuotes > 0 && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn(
            "p-1.5 sm:p-2 rounded-full transition-colors",
            isRunning ? "bg-primary/10" : "bg-muted"
          )}>
            <Quote className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-xs sm:text-sm">
              {metrics.favoriteQuotes} quote{metrics.favoriteQuotes !== 1 ? 's' : ''} saved
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              Keep collecting inspiration!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
