
import { useRef } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TimerExpandedView, TimerExpandedViewRef } from "./views/TimerExpandedView";
import { useTimerState } from "./state/TimerState";
import { useTimerHandlers } from "./handlers/TimerHandlers";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { useTimerView } from "./hooks/useTimerView";
import { CompletionView } from "./views/CompletionView";
import { MainTimerView } from "./views/MainTimerView";
import type { TimerProps, SoundOption } from "@/types/timer";

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

  const {
    handleComplete,
    handleAddTimeAndContinue,
    handleToggle: handleTimerToggle,
    handleCloseCompletion,
    handleAddTime,
    handleClose: handleCloseTimer,
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

  useTimerMonitor({
    timeLeft,
    isRunning,
    metrics,
    componentName: 'Timer'
  });

  const { getTimerCircleProps, getTimerControlsProps } = useTimerView({
    isRunning,
    timeLeft,
    minutes,
    metrics,
    isExpanded,
    handleTimerToggle,
    handleComplete,
    handleAddTime,
    pauseTimeLeft,
  });

  if (showCompletion && completionMetrics) {
    return <CompletionView metrics={completionMetrics} onComplete={handleCloseCompletion} />;
  }

  const timerCircleProps = getTimerCircleProps();
  const timerControlsProps = getTimerControlsProps();

  return (
    <>
      {isExpanded && (
        <TimerExpandedView
          ref={expandedViewRef}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={{
            ...timerControlsProps,
            size: "large"
          }}
          metrics={metrics}
          onClose={handleCloseTimer}
          onLike={() => updateMetrics(prev => ({ ...prev, favoriteQuotes: prev.favoriteQuotes + 1 }))}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}

      <MainTimerView
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        showCompletion={showCompletion}
        taskName={taskName}
        timerCircleProps={timerCircleProps}
        timerControlsProps={timerControlsProps}
        metrics={metrics}
        internalMinutes={internalMinutes}
        handleMinutesChange={setInternalMinutes}
        selectedSound={selectedSound}
        setSelectedSound={(sound: SoundOption) => setSelectedSound(sound)}
        testSound={testSound}
        isLoadingAudio={isLoadingAudio}
        updateMetrics={updateMetrics}
        expandedViewRef={expandedViewRef}
        handleCloseTimer={handleCloseTimer}
        favorites={favorites}
        setFavorites={setFavorites}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </>
  );
};

Timer.displayName = 'Timer';
