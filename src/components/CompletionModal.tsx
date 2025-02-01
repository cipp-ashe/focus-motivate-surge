import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Timer, Clock, Pause, Quote } from "lucide-react";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";

interface CompletionMetrics {
  startTime: Date;
  endTime: Date;
  pauseCount: number;
  favoriteQuotes: number;
  originalDuration: number;
  actualDuration: number;
}

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: CompletionMetrics;
  taskName: string;
}

export const CompletionModal = memo(({ isOpen, onClose, metrics, taskName }: CompletionModalProps) => {
  const {
    startTime,
    endTime,
    pauseCount,
    favoriteQuotes,
    originalDuration,
    actualDuration,
  } = metrics;

  const calculateEfficiency = () => {
    if (actualDuration === 0) return "100.0";
    if (actualDuration < originalDuration) return "100.0";
    return ((originalDuration / actualDuration) * 100).toFixed(1);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
  };

  const MetricItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/40 transition-colors duration-300">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Task Complete! 🎉
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-2 text-center">{taskName}</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Here's how your session went
          </p>

          <div className="grid gap-4">
            <MetricItem
              icon={Timer}
              label="Total Time"
              value={formatDuration(Math.round(actualDuration))}
            />
            
            <MetricItem
              icon={Clock}
              label="Focus Time"
              value={`${calculateEfficiency()}% efficiency`}
            />

            <div className="text-xs text-muted-foreground text-center">
              (Planned: {formatDuration(Math.round(originalDuration))})
            </div>

            <MetricItem
              icon={Pause}
              label="Focus Breaks"
              value={`${pauseCount} ${pauseCount === 1 ? 'break' : 'breaks'}`}
            />

            <MetricItem
              icon={Quote}
              label="Inspiring Quotes"
              value={`${favoriteQuotes} ${favoriteQuotes === 1 ? 'quote' : 'quotes'} saved`}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary transition-all duration-300 hover:scale-105"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CompletionModal.displayName = "CompletionModal";