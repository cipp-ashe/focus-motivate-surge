import { useState, useCallback } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";
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
        console.error('Audio error:', error);
        toast.error("Could not play sound. Please check your browser settings.");
      }
    }
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
      setIsExpanded(false);
      playSound();
      toast("Time's up! Great work! ✨");
    },
    onDurationChange,
  });

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
      setIsExpanded(true);
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
    />
  );
};