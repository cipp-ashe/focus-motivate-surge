import { TimerMetrics } from "@/types/timer";

interface TimerMetricsDisplayProps {
  metrics: TimerMetrics;
  isRunning: boolean;
}

export const TimerMetricsDisplay = ({ metrics, isRunning }: TimerMetricsDisplayProps) => {
  if (!metrics || !isRunning) return null;

  return (
    <div className="text-sm text-muted-foreground space-y-1">
      <p>Pauses: {metrics.pauseCount}</p>
      <p>Quotes saved: {metrics.favoriteQuotes}</p>
    </div>
  );
};