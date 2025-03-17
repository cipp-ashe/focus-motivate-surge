
import React from "react";
import { TimerCircle } from "../components/TimerCircle";
import { TimerControls } from "../components/TimerControls";
import { TimerMinutesInput } from "../components/TimerMinutesInput";
import { TimerTaskDisplay } from "../components/TimerTaskDisplay";
import { TimerSoundSelector } from "../components/TimerSoundSelector";
import { TimerMetrics } from "../TimerMetrics";
import { TimerQuote } from "../components/TimerQuote";
import { Card } from "@/components/ui/card";
import { SoundOption } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote } from "@/types/timer";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface TimerCompactViewProps {
  isExpanded: boolean;
  setIsExpanded: () => void;
  showCompletion: boolean;
  timerCircleProps: any;
  timerControlsProps: any;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  taskName: string;
  metrics: TimerStateMetrics;
  isRunning: boolean;
  selectedSound: SoundOption;
  setSelectedSound: (sound: SoundOption) => void;
  testSound: () => void;
  isLoadingAudio: boolean;
  setShowConfirmation: (show: boolean) => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerCompactView: React.FC<TimerCompactViewProps> = ({
  isExpanded,
  setIsExpanded,
  showCompletion,
  timerCircleProps,
  timerControlsProps,
  internalMinutes,
  handleMinutesChange,
  taskName,
  metrics,
  isRunning,
  selectedSound,
  setSelectedSound,
  testSound,
  isLoadingAudio,
  setShowConfirmation,
  favorites,
  setFavorites,
}) => {
  // Don't render if expanded or in completion state
  if (isExpanded || showCompletion) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 py-2 px-4">
      <div className="flex items-center">
        <TimerTaskDisplay
          taskName={taskName}
          className="flex-1 text-xl font-semibold mt-2"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={setIsExpanded}
          title="Expand timer"
          className="ml-2"
        >
          <ArrowUp className="h-4 w-4" />
          <span className="sr-only">Expand</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-auto flex-1">
          <TimerCircle
            size={200}
            strokeWidth={12}
            className="mx-auto"
            {...timerCircleProps}
          />
        </div>

        <div className="w-full md:w-auto flex flex-col gap-3 flex-1">
          <Card className="p-4 bg-muted/40">
            <TimerMinutesInput
              value={internalMinutes}
              onChange={handleMinutesChange}
              disabled={isRunning}
            />
          </Card>

          <TimerControls size="medium" {...timerControlsProps} />

          <TimerSoundSelector
            selectedSound={selectedSound}
            setSelectedSound={setSelectedSound}
            testSound={testSound}
            isLoadingAudio={isLoadingAudio}
          />
        </div>
      </div>

      <Card className="p-4 bg-muted/40">
        <TimerQuote favorites={favorites} setFavorites={setFavorites} />
      </Card>

      <TimerMetrics metrics={metrics} taskName={taskName} />
    </div>
  );
};
