import { memo, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { Notes, NotesRef } from "../../notes/Notes";

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
    onAddTime: () => void;
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

export interface TimerExpandedViewRef {
  saveNotes: () => void;
}

export const TimerExpandedView = memo(forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(({
  taskName,
  timerCircleProps,
  timerControlsProps: originalTimerControlsProps,
  metrics,
  onClose,
  onLike,
  favorites,
  setFavorites,
}, ref) => {
  const notesRef = useRef<NotesRef>(null);

  // Expose saveNotes method via ref
  useImperativeHandle(ref, () => ({
    saveNotes: () => {
      notesRef.current?.saveCurrentNote();
    }
  }), []);

  // Wrap the original onComplete to save notes first
  const timerControlsProps = {
    ...originalTimerControlsProps,
    onComplete: () => {
      notesRef.current?.saveCurrentNote();
      originalTimerControlsProps.onComplete();
    }
  };

  return (
    <div className="relative w-full max-w-[1200px] mx-auto px-4 py-8 z-[101] flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2 flex flex-col gap-4">
        <Card className="bg-card/90 backdrop-blur-md shadow-lg p-6 sm:p-8 border-primary/20">
          <div className="space-y-8">
            <TimerHeader taskName={taskName} />
            
            <div className="flex flex-col items-center gap-8 sm:gap-12">
              <div className="scale-110 sm:scale-125 transform-gpu">
                <TimerDisplay
                  circleProps={timerCircleProps}
                  size="large"
                  isRunning={timerCircleProps.isRunning}
                />
              </div>

              <div className="w-full max-w-md px-4">
                <TimerControls {...timerControlsProps} />
                <TimerMetricsDisplay 
                  metrics={metrics}
                  isRunning={timerCircleProps.isRunning}
                />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-card/90 backdrop-blur-md shadow-lg p-6 border-primary/20">
          <QuoteDisplay 
            showAsOverlay
            currentTask={taskName}
            onLike={onLike}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </Card>
      </div>

      <Card className="lg:w-1/2 bg-card/90 backdrop-blur-md shadow-lg border-primary/20 flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Session Notes
          </h2>
          <div className="flex-1">
            <Notes ref={notesRef} compact />
          </div>
        </div>
      </Card>
    </div>
  );
}));

TimerExpandedView.displayName = 'TimerExpandedView';
