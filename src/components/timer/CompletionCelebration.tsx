import { TimerConfetti } from "./TimerConfetti";
import { TimerStateMetrics } from "@/types/metrics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Timer, Clock, Pause, Quote, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";

interface CompletionCelebrationProps {
  show: boolean;
  metrics: TimerStateMetrics;
  taskName: string;
  onClose: () => void;
  width: number;
  height: number;
}

export const CompletionCelebration = ({
  show,
  metrics,
  taskName,
  onClose,
  width,
  height,
}: CompletionCelebrationProps) => {
  const formatDuration = (seconds: number) => {
    // Ensure we're working with a valid number
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      console.warn('Invalid duration received:', seconds);
      return '0 secs';
    }

    const totalSeconds = Math.round(seconds);
    if (totalSeconds < 60) {
      return `${totalSeconds} sec${totalSeconds !== 1 ? 's' : ''}`;
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    if (minutes < 60) {
      return remainingSeconds > 0
        ? `${minutes}m ${remainingSeconds}s`
        : `${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
  };

  const MetricItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors duration-300">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  );

  if (!show || !metrics) return null;

  const safeMetrics = {
    originalDuration: metrics.originalDuration ?? 0,
    actualDuration: metrics.actualDuration ?? 0,
    netEffectiveTime: metrics.netEffectiveTime ?? 0,
    efficiencyRatio: metrics.efficiencyRatio ?? 0,
    pauseCount: metrics.pauseCount ?? 0,
    favoriteQuotes: metrics.favoriteQuotes ?? 0,
    pausedTime: metrics.pausedTime ?? 0,
    extensionTime: metrics.extensionTime ?? 0,
    completionStatus: metrics.completionStatus ?? 'Completed',
  };

  return (
    <>
      {/* Background and confetti layer */}
      <div className="fixed inset-0 z-[1]">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
        <TimerConfetti
          show={show}
          width={width}
          height={height}
        />
      </div>

      {/* Modal layer */}
      <div className="fixed inset-0 z-[2] flex items-center justify-center p-4">
        <Dialog open={show} onOpenChange={onClose}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Task Complete! 🎉
                </span>
              </DialogTitle>
              <DialogDescription className="text-center">
                {taskName}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Here's how your session went
              </p>

              <div className="grid gap-2">
                <MetricItem
                  icon={Timer}
                  label="Planned Duration"
                  value={formatDuration(safeMetrics.originalDuration)}
                />
                
                <MetricItem
                  icon={Clock}
                  label="Total Time Spent"
                  value={formatDuration(safeMetrics.actualDuration)}
                />

                <MetricItem
                  icon={Clock}
                  label="Active Working Time"
                  value={formatDuration(safeMetrics.netEffectiveTime)}
                />

                <div className="text-xs text-muted-foreground text-center">
                  Efficiency Score: {safeMetrics.efficiencyRatio.toFixed(1)}%
                  {safeMetrics.efficiencyRatio > 80 && " 🎯"}
                  {safeMetrics.efficiencyRatio > 95 && " 🌟"}
                </div>

                <MetricItem
                  icon={Pause}
                  label="Focus Breaks"
                  value={`${safeMetrics.pauseCount} ${safeMetrics.pauseCount === 1 ? 'break' : 'breaks'} (${formatDuration(safeMetrics.pausedTime)})`}
                />

                {safeMetrics.extensionTime > 0 && (
                  <MetricItem
                    icon={Timer}
                    label="Added Time"
                    value={formatDuration(safeMetrics.extensionTime)}
                  />
                )}

                <MetricItem
                  icon={Quote}
                  label="Inspiring Quotes"
                  value={`${safeMetrics.favoriteQuotes} ${safeMetrics.favoriteQuotes === 1 ? 'quote' : 'quotes'} saved`}
                />
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary transition-all duration-300 hover:scale-105"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

CompletionCelebration.displayName = 'CompletionCelebration';
