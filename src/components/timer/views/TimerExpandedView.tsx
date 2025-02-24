
import { forwardRef, memo } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { NotesEditor } from "../../notes/NotesEditor";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TimerExpandedViewRef {
  saveNotes: () => void;
}

interface TimerExpandedViewProps {
  taskName: string;
  timerCircleProps: {
    isRunning: boolean;
    timeLeft: number;
    minutes: number;
    circumference: number;
  };
  timerControlsProps: {
    isRunning: boolean;
    onToggle: () => void;
    onComplete: () => void;
    onAddTime?: () => void;
    metrics: TimerStateMetrics;
    showAddTime: boolean;
    size: "large";
  };
  metrics: TimerStateMetrics;
  onClose: () => void;
  onLike: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerExpandedView = memo(forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  onClose,
  onLike,
  favorites,
  setFavorites,
}, ref) => {
  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
    >
      {/* Overlay/Backdrop */}
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-md" 
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="container mx-auto p-6 flex flex-col gap-6 min-h-screen max-w-[1400px]">
          <QuoteDisplay 
            showAsOverlay
            currentTask={taskName}
            onLike={onLike}
            favorites={favorites}
            setFavorites={setFavorites}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6">
            {/* Timer Section */}
            <Card className="bg-card/90 backdrop-blur-md shadow-lg p-8 border-primary/20">
              <div className="flex flex-col items-center gap-8">
                <div className="text-center w-full">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">
                    {taskName}
                  </h1>
                </div>
                
                <div className="relative w-full max-w-[500px] mx-auto">
                  <TimerDisplay
                    circleProps={timerCircleProps}
                    size="large"
                    isRunning={timerCircleProps.isRunning}
                  />
                </div>

                <div className="w-full max-w-[500px] mx-auto">
                  <TimerControls {...timerControlsProps} />
                </div>
              </div>
            </Card>

            {/* Metrics Section */}
            <Card className="bg-card/90 backdrop-blur-md shadow-lg border-primary/20">
              <div className="p-6 h-full">
                <TimerMetricsDisplay
                  metrics={metrics}
                  isRunning={timerCircleProps.isRunning}
                />
              </div>
            </Card>
          </div>

          {/* Notes Section */}
          <Card className="bg-card/90 backdrop-blur-md shadow-lg border-primary/20 flex-1 min-h-[300px]">
            <div className="p-6 h-full flex flex-col">
              <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Quick Notes
              </h2>
              <div className="flex-1">
                <NotesEditor ref={ref} />
              </div>
            </div>
          </Card>

          <Button
            onClick={onClose}
            className="fixed top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background/90 transition-colors"
            variant="ghost"
            size="icon"
          >
            <Minimize2 className="h-4 w-4" />
            <span className="sr-only">Collapse timer view</span>
          </Button>
        </div>
      </div>
    </div>
  );
}));

TimerExpandedView.displayName = 'TimerExpandedView';

