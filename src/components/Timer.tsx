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
  
  // Convert duration from seconds to minutes for internal state
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

  // Start handler that automatically expands the view
  const handleStart = useCallback(() => {
    start();
    setIsExpanded(true);
  }, [start]);

  const handleComplete = useCallback(() => {
    completeTimer();
    pause();
    onComplete();
    setIsExpanded(false);
    toast("Task completed! You're crushing it! 🎉");
  }, [completeTimer, pause, onComplete]);

  const handleAddTime = useCallback(() => {
    addMinutes(ADD_TIME_MINUTES);
    onAddTime();
    toast(`Added ${ADD_TIME_MINUTES} minutes. Keep going! 💪`);
  }, [addMinutes, onAddTime]);

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: CIRCLE_CIRCUMFERENCE,
  };

  const timerControlsProps = {
    isRunning,
    onToggle: isRunning ? pause : handleStart,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
  };

  if (isExpanded) {
    return (
      <ExpandedTimer
        {...{
          taskName,
          isRunning,
          onClose: () => setIsExpanded(false),
          timerCircleProps,
          timerControlsProps,
          favorites: favorites || [],
          setFavorites,
        }}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-start">
      <CompactTimer
        {...{
          taskName,
          isRunning,
          minutes: internalMinutes,
          selectedSound,
          onSoundChange: setSelectedSound,
          onTestSound: testSound,
          onMinutesChange: handleMinutesChange,
          minMinutes: MIN_MINUTES,
          maxMinutes: MAX_MINUTES,
          isLoadingAudio,
          timerCircleProps,
          timerControlsProps: {
            ...timerControlsProps,
            onToggle: handleStart, // In configuration mode, always start and expand
          },
          onClick: () => isRunning && setIsExpanded(true), // Only allow expanding when running
        }}
      />
    </div>
  );
};

Timer.displayName = 'Timer';