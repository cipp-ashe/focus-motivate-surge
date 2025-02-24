
import { memo } from "react";
import { Card } from "../../ui/card";
import { TimerHeader } from "../TimerHeader";
import { TimerDisplay } from "../TimerDisplay";
import { TimerControls } from "../controls/TimerControls";
import { MinutesInput } from "../../minutes/MinutesInput";
import { SoundSelector } from "../../SoundSelector";
import { Quote, SoundOption } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { ChevronUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  internalMinutes,
  onMinutesChange,
  selectedSound,
  onSoundChange,
  onTestSound,
  isLoadingAudio,
  onExpand,
}: TimerCompactViewProps) => {
  return (
    <Card className="relative p-3 w-full mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 p-1 h-6 w-6"
        onClick={onExpand}
      >
        <ChevronUpIcon className="h-4 w-4" />
      </Button>

      <div className="space-y-2">
        <TimerHeader taskName={taskName} />

        <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
          <TimerDisplay
            circleProps={timerCircleProps}
            size="normal"
            onClick={onExpand}
            isRunning={timerCircleProps.isRunning}
          />

          <div className="flex flex-col gap-2">
            <div className={`transition-all duration-300 ${
              timerCircleProps.isRunning ? 'opacity-0' : 'opacity-100'
            }`}>
              <MinutesInput
                minutes={Math.floor(timerCircleProps.minutes)}
                onMinutesChange={onMinutesChange}
                minMinutes={1}
                maxMinutes={60}
              />
            </div>

            <div className={`transition-all duration-300 ${
              timerCircleProps.isRunning ? 'opacity-0' : 'opacity-100'
            }`}>
              <SoundSelector
                selectedSound={selectedSound}
                onSoundChange={onSoundChange}
                onTestSound={onTestSound}
                isLoadingAudio={isLoadingAudio}
              />
            </div>
          </div>
        </div>

        <TimerControls {...timerControlsProps} />
      </div>
    </Card>
  );
});

TimerCompactView.displayName = 'TimerCompactView';
