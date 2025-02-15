
import { useCallback, useRef, useEffect } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TIMER_CONSTANTS } from "@/types/timer";
import { CompletionCelebration } from "./CompletionCelebration";
import { TimerExpandedViewRef } from "./views/TimerExpandedView";
import { useTimerState } from "./state/TimerState";
import { useTimerHandlers } from "./handlers/TimerHandlers";
import { TimerBody } from "./components/TimerBody";
import { TimerCompletion } from "./components/TimerCompletion";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
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
  console.log('Timer component rendering with:', {
    duration,
    taskName,
    isValid: Boolean(duration && taskName)
  });

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

  // Add timer monitoring for better performance and debugging
  useTimerMonitor({
    timeLeft,
    isRunning,
    metrics,
    componentName: 'Timer'
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

  // Auto-expand when timer starts or is paused
  useEffect(() => {
    if (isRunning || metrics.isPaused) {
      console.log('Auto-expanding timer due to:', { isRunning, isPaused: metrics.isPaused });
      setIsExpanded(true);
    }
  }, [isRunning, metrics.isPaused, setIsExpanded]);

  const handleTimerToggle = useCallback(() => {
    console.log('Timer toggle called:', { isRunning });
    handleToggle();
  }, [handleToggle, isRunning]);

  const handleCloseTimer = useCallback(() => {
    if (!showCompletion && !isRunning && !metrics.isPaused) {
      console.log('Closing timer view');
      setIsExpanded(false);
    }
  }, [showCompletion, isRunning, metrics.isPaused, setIsExpanded]);

  const handleMinutesChange = useCallback((newMinutes: number) => {
    const clampedMinutes = Math.min(Math.max(newMinutes, 1), 60);
    setInternalMinutes(clampedMinutes);
    setMinutes(clampedMinutes);
    if (onDurationChange) {
      onDurationChange(clampedMinutes);
    }
  }, [setMinutes, onDurationChange, setInternalMinutes]);

  if (showCompletion && completionMetrics) {
    console.log('Rendering completion view');
    return (
      <div className="animate-fade-in">
        <CompletionCelebration
          metrics={completionMetrics}
          onComplete={handleCloseCompletion}
        />
      </div>
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
    onToggle: handleTimerToggle,
    isPaused: metrics.isPaused,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
    showAddTime: isExpanded,
    pauseTimeLeft,
    size: 'normal' as const,
  };

  console.log('Timer rendering with props:', {
    isRunning,
    timeLeft,
    minutes,
    isExpanded
  });

  return (
    <div className={`relative w-full transition-all duration-300 ${isExpanded ? 'scale-102' : 'scale-100'}`}>
      <div className={`relative bg-background/95 backdrop-blur-xl shadow-lg rounded-lg transition-all duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
      </div>

      {isExpanded && (
        <TimerExpandedView
          ref={expandedViewRef}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={{
            ...timerControlsProps,
            size: "large" as const
          }}
          metrics={metrics}
          onClose={handleCloseTimer}
          onLike={() => updateMetrics(prev => ({ favoriteQuotes: prev.favoriteQuotes + 1 }))}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}

      <TimerCompletion
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </div>
  );
};

Timer.displayName = 'Timer';
