import { useState, useCallback } from "react";
import { Card } from "./ui/card";
import { Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { CompactTimer } from "./CompactTimer";
import { ExpandedTimer } from "./ExpandedTimer";
import { useAudio } from "../hooks/useAudio";
import { useTimer } from "../hooks/useTimer";
import { useTimerShortcuts } from "../hooks/useTimerShortcuts";
import { useTimerA11y } from "../hooks/useTimerA11y";
import {
  TimerProps,
  TIMER_CONSTANTS,
  SOUND_OPTIONS,
  type SoundOption,
} from "../types/timer";

const {
  MIN_MINUTES,
  MAX_MINUTES,
  ADD_TIME_MINUTES,
  CIRCLE_CIRCUMFERENCE,
} = TIMER_CONSTANTS;

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites,
  setFavorites
}: TimerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>("bell");
  
  const { play: playSound, testSound, isLoadingAudio } = useAudio({
    audioUrl: SOUND_OPTIONS[selectedSound],
    options: {
      onError: (error) => {
        console.error("Audio error:", error);
        toast.error("Could not play sound. Please check your browser settings.");
      },
    },
  });

  const {
    timeLeft,
    minutes,
    isRunning,
    start,
    pause,
    addTime: addMinutes,
    setMinutes: handleMinutesChange,
  } = useTimer({
    initialDuration: duration,
    onTimeUp: () => {
      playSound();
      toast("Time's up! Great work! ✨");
      onComplete();
    },
    onDurationChange,
  });

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  const handleComplete = useCallback(() => {
    pause();
    onComplete();
    setIsExpanded(false);
    toast("Task completed! You're crushing it! 🎉");
  }, [pause, onComplete]);

  const handleAddTime = useCallback(() => {
    addMinutes(ADD_TIME_MINUTES);
    onAddTime();
    start();
  }, [addMinutes, onAddTime, start]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: CIRCLE_CIRCUMFERENCE,
  };

  const timerControlsProps = {
    isRunning,
    onToggle: toggleTimer,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
  };

  const commonProps = {
    taskName,
    isRunning,
    timerCircleProps,
    timerControlsProps,
  };

  if (isExpanded) {
    return (
      <ExpandedTimer
        {...commonProps}
        onClose={() => setIsExpanded(false)}
        favorites={favorites || []}
        setFavorites={setFavorites}
      />
    );
  }

  return (
    <div className="relative">
      <CompactTimer
        {...commonProps}
        minutes={minutes}
        selectedSound={selectedSound}
        onSoundChange={setSelectedSound}
        onTestSound={testSound}
        onMinutesChange={handleMinutesChange}
        minMinutes={MIN_MINUTES}
        maxMinutes={MAX_MINUTES}
        isLoadingAudio={isLoadingAudio}
        onClick={toggleExpand}
      />

      <button
        onClick={toggleExpand}
        className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-foreground"
        aria-label={isExpanded ? "Minimize timer view" : "Expand timer view"}
      >
        {isExpanded ? (
          <Minimize2 className="h-6 w-6" />
        ) : (
          <Maximize2 className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};