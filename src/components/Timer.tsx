import { useState, useCallback, useEffect } from 'react';
import { Card } from "./ui/card";
import { CompactTimer } from "./CompactTimer";
import { ExpandedTimer } from "./ExpandedTimer";
import { useAudio } from "../hooks/useAudio";
import { useTimerState } from "../hooks/useTimerState";
import { useTimerShortcuts } from "../hooks/useTimerShortcuts";
import { useTimerA11y } from "../hooks/useTimerA11y";
import {
  TimerProps,
  TIMER_CONSTANTS,
  SOUND_OPTIONS,
  type SoundOption,
} from "../types/timer";
import { toast } from "sonner";

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
  
  // Convert duration from seconds to minutes, defaulting to 25 if not provided
  const initialMinutes = Math.floor(duration / 60) || 25;
  const [internalMinutes, setInternalMinutes] = useState(initialMinutes);
  
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
    metrics,
    start,
    pause,
    addTime: addMinutes,
    setMinutes,
    completeTimer,
  } = useTimerState({
    initialDuration: internalMinutes * 60,
    onTimeUp: () => {
      completeTimer();
      playSound();
      toast("Time's up! Great work! ✨");
    },
    onDurationChange,
  });

  // Only update internal minutes when duration changes and timer is not running
  useEffect(() => {
    if (!isRunning && duration > 0 && duration !== internalMinutes * 60) {
      console.log(`Task duration changed to ${Math.floor(duration / 60)} minutes`);
      setInternalMinutes(Math.floor(duration / 60));
      setMinutes(Math.floor(duration / 60));
    }
  }, [duration, setMinutes, isRunning, internalMinutes]);

  const handleMinutesChange = useCallback((newMinutes: number) => {
    console.log(`Updating timer duration to ${newMinutes} minutes`);
    setInternalMinutes(newMinutes);
    setMinutes(newMinutes);
  }, [setMinutes]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
      setIsExpanded(true);
    }
  }, [isRunning, start, pause]);

  const handleComplete = useCallback(() => {
    completeTimer();
    pause();
    onComplete();
    setIsExpanded(false);
    toast("Task completed! You're crushing it! 🎉");
  }, [pause, onComplete, completeTimer]);

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
    metrics,
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
    <div className="w-full flex flex-col items-center justify-start">
      <CompactTimer
        {...commonProps}
        minutes={internalMinutes}
        selectedSound={selectedSound}
        onSoundChange={setSelectedSound}
        onTestSound={testSound}
        onMinutesChange={handleMinutesChange}
        minMinutes={MIN_MINUTES}
        maxMinutes={MAX_MINUTES}
        isLoadingAudio={isLoadingAudio}
        onClick={() => isRunning && setIsExpanded(true)}
      />
    </div>
  );
};

Timer.displayName = 'Timer';