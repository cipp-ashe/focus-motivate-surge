
import { forwardRef, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { NotesEditor } from "../../notes/NotesEditor";
import { Minimize2, ClipboardList, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    onComplete: () => Promise<void>;
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
      className="fixed inset-0 z-[9999]"
    >
      {/* Overlay/Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-xl" 
        aria-hidden="true"
      />
      
      {/* Content - Full height scrollable content */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex flex-col py-8 px-4 sm:px-6">
          <div className="container mx-auto flex-1 flex flex-col gap-8 max-w-6xl">
            {/* Quotes Display */}
            <div className="relative z-10 mb-2">
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
                <CardHeader className="pb-0 pt-6">
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 tracking-tight text-center">
                    {taskName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center gap-10">
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
                </CardContent>
              </Card>

              {/* Metrics Section */}
              <Card className="bg-card/90 backdrop-blur-md shadow-xl border-primary/20 overflow-hidden">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                    <BarChart className="h-5 w-5 text-primary" />
                    Session Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TimerMetricsDisplay
                    metrics={metrics}
                    isRunning={timerCircleProps.isRunning}
                  />
                </CardContent>
              </Card>
            </div>

            <Separator className="my-2 bg-primary/10" />

            {/* Notes Section */}
            <Card className="bg-card/90 backdrop-blur-md shadow-xl border-primary/20 flex-1 min-h-[250px]">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Quick Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex-1 bg-card/30 rounded-lg p-4 min-h-[200px] border border-primary/10">
                  <NotesEditor ref={ref} />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={onClose}
              className="fixed top-6 right-6 p-3 rounded-full bg-background/80 hover:bg-background/95 transition-colors shadow-md border border-primary/10"
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
