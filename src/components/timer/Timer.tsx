
import { useRef, useEffect } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TimerExpandedView, TimerExpandedViewRef } from "./views/TimerExpandedView";
import { useTimerState } from "./state/TimerState";
import { useTimerHandlers } from "./handlers/TimerHandlers";
import { useTimerMonitor } from "@/hooks/useTimerMonitor";
import { useTimerView } from "./hooks/useTimerView";
import { CompletionView } from "./views/CompletionView";
import { MainTimerView } from "./views/MainTimerView";
import type { TimerProps, SoundOption } from "@/types/timer";
import { eventBus } from "@/lib/eventBus";

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
    addTime,
    setMinutes,
    completeTimer,
    updateMetrics,
    playSound,
    testSound,
    isLoadingAudio,
    reset,
  } = useTimerState({
    duration,
    onComplete,
    onAddTime,
    onDurationChange,
  });

  // Listen for timer:init events
  useEffect(() => {
    const unsubscribe = eventBus.on('timer:init', ({ taskName, duration }) => {
      console.log('Timer initialized with:', { taskName, duration });
      setInternalMinutes(Math.floor(duration / 60));
      reset();
    });

    return () => unsubscribe();
  }, [setInternalMinutes, reset]);

  // Listen for timer view state changes
  useEffect(() => {
    const unsubscribeExpand = eventBus.on('timer:expand', ({ taskName: eventTaskName }) => {
      if (eventTaskName === taskName) {
        console.log('Timer expanding view for:', eventTaskName);
        setIsExpanded(true);
      }
    });

    const unsubscribeCollapse = eventBus.on('timer:collapse', ({ taskName: eventTaskName }) => {
      if (eventTaskName === taskName) {
        console.log('Timer collapsing view for:', eventTaskName);
        if (expandedViewRef.current?.saveNotes) {
          expandedViewRef.current.saveNotes();
        }
        setIsExpanded(false);
      }
    });

    return () => {
      unsubscribeExpand();
      unsubscribeCollapse();
    };
  }, [setIsExpanded, taskName]);

  const {
    handleComplete,
    handleAddTimeAndContinue,
    handleToggle: handleTimerToggle,
    handleCloseCompletion,
    handleAddTime,
    handleCloseTimer,
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
    <div className="relative">
      {/* Base timer view with controlled visibility */}
      <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <MainTimerView
          isExpanded={isExpanded}
          setIsExpanded={() => eventBus.emit('timer:expand', { taskName })}
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
      </div>

      {/* Expanded view rendered at root level when active */}
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
          onClose={() => eventBus.emit('timer:collapse', { taskName })}
          onLike={() => updateMetrics(prev => ({ ...prev, favoriteQuotes: prev.favoriteQuotes + 1 }))}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
    </div>
  );
};

Timer.displayName = 'Timer';
