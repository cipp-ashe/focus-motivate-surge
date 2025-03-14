
import { memo } from "react";
import { Card, CardContent } from "../../ui/card";
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
import { Clock, Volume2 } from "lucide-react";
import { Separator } from "../../ui/separator";

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
    onComplete: () => Promise<void>;
    onAddTime?: (minutes: number) => void;
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Task name header with gradient text */}
      <div className="mb-8">
        <TimerHeader taskName={taskName} />
      </div>

      {/* Timer settings area - only visible when timer isn't running */}
      <div className={cn(
        "transition-all duration-500 overflow-hidden mb-8",
        timerCircleProps.isRunning ? 'h-0 opacity-0 max-h-0' : 'max-h-[600px] opacity-100'
      )}>
        <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-md">
          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-6 sm:grid-cols-2 items-start">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/80" />
                  <span>Duration</span>
                </h3>
                <MinutesInput
                  minutes={Math.floor(timerCircleProps.minutes)}
                  onMinutesChange={onMinutesChange}
                  minMinutes={1}
                  maxMinutes={60}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-primary/80" />
                  <span>Sound</span>
                </h3>
                <SoundSelector
                  selectedSound={selectedSound}
                  onSoundChange={onSoundChange}
                  onTestSound={onTestSound}
                  isLoadingAudio={isLoadingAudio}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timer display circle */}
      <div className="flex items-center justify-center py-4 mb-6">
        <TimerDisplay
          circleProps={timerCircleProps}
          size="normal"
          onClick={onExpand}
          isRunning={timerCircleProps.isRunning}
        />
      </div>

      {/* Timer controls */}
      <div className="max-w-md mx-auto w-full mb-8">
        <TimerControls {...timerControlsProps} />
      </div>

      {/* Metrics display */}
      <Card className="bg-card/40 backdrop-blur-sm border-primary/10 mb-8">
        <CardContent className="p-4 sm:p-5">
          <TimerMetricsDisplay
            metrics={metrics}
            isRunning={timerCircleProps.isRunning}
          />
        </CardContent>
      </Card>

      {/* Quote display */}
      <Separator className="my-6 bg-primary/10" />
      <div className="pt-2">
        <QuoteDisplay
          currentTask={taskName}
          onLike={onLike}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </div>
    </div>
  );
});

TimerCompactView.displayName = 'TimerCompactView';
