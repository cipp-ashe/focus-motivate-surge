
import { useCallback, useRef } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";
import { CompletionCelebration } from "./CompletionCelebration";
import { TimerExpandedViewRef } from "./views/TimerExpandedView";
import { useTimerState } from "./state/TimerState";
import { useTimerHandlers } from "./handlers/TimerHandlers";
import { TimerBody } from "./components/TimerBody";
import { TimerCompletion } from "./components/TimerCompletion";
import type { TimerProps } from "@/types/timer";

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites
}: TimerProps) => {
  const expandedViewRef = useRef<TimerExpandedViewRef>(null);

  const {
    isExpanded,
    setIsExpanded,
    selectedSound,
    setSelectedSound,
    showCompletion,
    setShowCompletion,
    showConfirmation,
    setShowConfirmation,
    completionMetrics,
    setCompletionMetrics,
    internalMinutes,
    setInternalMinutes,
    pauseTimeLeft,
    setPauseTimeLeft,
    pauseTimerRef,
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    completeTimer,
    updateMetrics,
    playSound,
    testSound,
    isLoadingAudio,
  } = useTimerState({
    duration,
    onComplete,
    onAddTime,
    onDurationChange,
  });

  const {
    handleComplete,
    handleAddTimeAndContinue,
    handleToggle,
    handleCloseCompletion,
    handleAddTime,
  } = useTimerHandlers({
    isRunning,
    start,
    pause,
    addTime,
    completeTimer,
    playSound,
    onAddTime,
    onComplete,
    setShowConfirmation,
    setCompletionMetrics,
    setShowCompletion,
    setIsExpanded,
    metrics,
    reset,
    updateMetrics,
    setPauseTimeLeft,
    pauseTimerRef,
  });

  const handleCloseTimer = useCallback(() => {
    if (!showCompletion) {
      setIsExpanded(false);
    }
  }, [showCompletion, setIsExpanded]);

  const handleMinutesChange = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.min(Math.max(newMinutes, 1), 60);
    setInternalMinutes(clampedMinutes);
    setMinutes(clampedMinutes);
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [setMinutes, onDurationChange, setInternalMinutes]);

  if (showCompletion && completionMetrics) {
    return (
      <CompletionCelebration
        metrics={completionMetrics}
        onComplete={handleCloseCompletion}
      />
    );
  }

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: TIMER_CONSTANTS.CIRCLE_CIRCUMFERENCE,
  };

  const timerControlsProps = {
    isRunning,
    onToggle: handleToggle,
    isPaused: metrics.isPaused,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
    showAddTime: isExpanded,
    pauseTimeLeft,
    size: 'normal' as const,
  };

  return (
    <>
      <TimerBody
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        showCompletion={showCompletion}
        taskName={taskName}
        timerCircleProps={timerCircleProps}
        timerControlsProps={timerControlsProps}
        metrics={metrics}
        internalMinutes={internalMinutes}
        handleMinutesChange={handleMinutesChange}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        testSound={testSound}
        isLoadingAudio={isLoadingAudio}
        updateMetrics={updateMetrics}
        expandedViewRef={expandedViewRef}
        handleCloseTimer={handleCloseTimer}
        favorites={favorites}
        setFavorites={setFavorites}
      />

      <TimerCompletion
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </>
  );
};

Timer.displayName = 'Timer';

