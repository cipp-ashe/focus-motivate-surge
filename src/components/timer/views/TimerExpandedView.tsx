
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
import { Maximize2, Minimize2, ClipboardList, BarChart } from "lucide-react";
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
    onComplete: () => Promise<void>; // Updated to Promise<void>
    onAddTime?: (minutes: number) => void;
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
      className="fixed inset-0 z-[9999]" // Z-index increased to ensure it's above everything
    >
      {/* Overlay/Backdrop - Made darker and with more blur for better focus */}
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-lg" 
        aria-hidden="true"
      />
      
      {/* Content - Full height scrollable content */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex flex-col py-8 px-4 sm:px-6">
          <div className="container mx-auto flex-1 flex flex-col gap-8 max-w-7xl">
            {/* Quotes Display */}
            <div className="relative z-10 mb-4">
              <QuoteDisplay 
                showAsOverlay
                currentTask={taskName}
                onLike={onLike}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-8">
              {/* Timer Section */}
              <Card className="bg-card/90 backdrop-blur-md shadow-xl border-primary/20 overflow-hidden">
                <div className="p-10 flex flex-col items-center gap-10">
                  <div className="text-center w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight">
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
              <Card className="bg-card/90 backdrop-blur-md shadow-xl border-primary/20 overflow-hidden">
                <div className="p-8 h-full">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                    <BarChart className="h-5 w-5 text-primary" />
                    Session Metrics
                  </h2>
                  <TimerMetricsDisplay
                    metrics={metrics}
                    isRunning={timerCircleProps.isRunning}
                  />
                </div>
              </Card>
            </div>

            {/* Notes Section */}
            <Card className="bg-card/90 backdrop-blur-md shadow-xl border-primary/20 flex-1 min-h-[300px]">
              <div className="p-8 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Quick Notes
                </h2>
                <div className="flex-1 bg-card/30 rounded-lg p-4">
                  <NotesEditor ref={ref} />
                </div>
              </div>
            </Card>

            <Button
              onClick={onClose}
              className="fixed top-6 right-6 p-3 rounded-full bg-background/80 hover:bg-background/90 transition-colors shadow-md"
              variant="ghost"
              size="icon"
              aria-label="Collapse timer view"
            >
              <Minimize2 className="h-5 w-5" />
              <span className="sr-only">Collapse timer view</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}));

TimerExpandedView.displayName = 'TimerExpandedView';
