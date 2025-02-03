import { memo } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";

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

export const TimerExpandedView = memo(({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  onClose,
  onLike,
  favorites,
  setFavorites,
}: TimerExpandedViewProps) => {
  return (
    <div className="relative w-full max-w-[600px] mx-auto px-4 py-8 z-[101]">
      <Card className="w-full bg-card/90 backdrop-blur-md shadow-lg p-6 sm:p-8 border-primary/20">
        <div className="space-y-8 sm:space-y-12">
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

      <div className="mt-8">
        <QuoteDisplay 
          showAsOverlay
          currentTask={taskName}
          onLike={onLike}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </div>
    </div>
  );
});

TimerExpandedView.displayName = 'TimerExpandedView';