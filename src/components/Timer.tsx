import { useState, useCallback } from "react";
import { toast } from "sonner";
import { CompactTimer } from "./CompactTimer";
import { ExpandedTimer } from "./ExpandedTimer";
import { TimerErrorBoundary } from "./TimerErrorBoundary";
import { ShortcutsInfo } from "./ShortcutsInfo";
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
  const { play: playSound, testSound } = useAudio(SOUND_OPTIONS[selectedSound]);

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

  // Set up keyboard shortcuts
  const { shortcuts } = useTimerShortcuts({
    isRunning,
    onToggle: toggleTimer,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
  });

  // Set up accessibility features
  const {
    getTimerA11yProps,
    getToggleButtonA11yProps,
    getCompleteButtonA11yProps,
    getAddTimeButtonA11yProps,
  } = useTimerA11y({
    isRunning,
    timeLeft,
    taskName,
    isExpanded,
  });

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: CIRCLE_CIRCUMFERENCE,
    a11yProps: getTimerA11yProps(),
  };

  const timerControlsProps = {
    isRunning,
    onToggle: toggleTimer,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    toggleButtonA11yProps: getToggleButtonA11yProps(),
    completeButtonA11yProps: getCompleteButtonA11yProps(),
    addTimeButtonA11yProps: getAddTimeButtonA11yProps(),
  };

  const commonProps = {
    taskName,
    isRunning,
    timerCircleProps,
    timerControlsProps,
  };

  const timerContent = isExpanded ? (
    <ExpandedTimer
      {...commonProps}
      onClose={() => setIsExpanded(false)}
      favorites={favorites}
      setFavorites={setFavorites}
      a11yProps={getTimerA11yProps()}
    />
  ) : (
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
        a11yProps={getTimerA11yProps()}
      />
      <ShortcutsInfo shortcuts={shortcuts} />
    </div>
  );

  return (
    <TimerErrorBoundary>
      {timerContent}
    </TimerErrorBoundary>
  );
};
