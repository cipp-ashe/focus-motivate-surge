import { memo } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { TimerMetricsDisplay } from "../TimerMetrics";
import { QuoteDisplay } from "../../quotes/QuoteDisplay";
import { MinutesInput } from "../../minutes/MinutesInput";
import { SoundSelector } from "../../SoundSelector";
import { Quote, SoundOption } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { cn } from "@/lib/utils";

interface TimerCompactViewProps {
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
    size: "normal";
  };
  metrics: TimerStateMetrics;
  internalMinutes: number;
  onMinutesChange: (minutes: number) => void;
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio: boolean;
  onExpand: () => void;
  onLike: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerCompactView = memo(({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  onMinutesChange,
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio,
  onExpand,
  onLike,
  favorites,
  setFavorites,
}: TimerCompactViewProps) => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <TimerHeader taskName={taskName} />

      <div className={cn(
        "transition-all duration-700",
        timerCircleProps.isRunning ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
      )}>
        <div className="grid gap-6 sm:grid-cols-2 items-start">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/70">Duration</h3>
            <MinutesInput
              minutes={Math.floor(timerCircleProps.minutes)}
              onMinutesChange={onMinutesChange}
              minMinutes={1}
              maxMinutes={60}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/70">Sound</h3>
            <SoundSelector
              selectedSound={selectedSound}
              onSoundChange={onSoundChange}
              onTestSound={onTestSound}
              isLoadingAudio={isLoadingAudio}
            />
          </div>
        </div>
      </div>

      <TimerDisplay
        circleProps={timerCircleProps}
        size="normal"
        onClick={onExpand}
        isRunning={timerCircleProps.isRunning}
      />

      <TimerControls {...timerControlsProps} />

      <TimerMetricsDisplay
        metrics={metrics}
        isRunning={timerCircleProps.isRunning}
      />

      <QuoteDisplay
        currentTask={taskName}
        onLike={onLike}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </div>
  );
});

TimerCompactView.displayName = 'TimerCompactView';
