import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Timer, Clock, Pause, Heart, Quote, LucideIcon } from "lucide-react";
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
    return ((originalDuration / actualDuration) * 100).toFixed(1);
  };

  const MetricItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
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
      <DialogContent className="sm:max-w-md">
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
              label="Session Duration"
              value={formatDistanceToNow(startTime, { addSuffix: false })}
            />
            
            <MetricItem
              icon={Clock}
              label="Time Efficiency"
              value={`${calculateEfficiency()}%`}
            />

            <MetricItem
              icon={Pause}
              label="Focus Breaks"
              value={`${pauseCount} ${pauseCount === 1 ? 'pause' : 'pauses'}`}
            />

            <MetricItem
              icon={Quote}
              label="Inspiring Quotes"
              value={`${favoriteQuotes} favorited`}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

CompletionModal.displayName = "CompletionModal";