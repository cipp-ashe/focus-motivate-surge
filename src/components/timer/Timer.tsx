
import { useRef, useEffect, useCallback } from "react";
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
    taskName,
    onComplete,
    onAddTime,
    onDurationChange,
  });

  // Handle timer initialization
  useEffect(() => {
    const unsubscribe = eventBus.on('timer:init', ({ taskName: eventTaskName, duration: newDuration }) => {
      if (eventTaskName === taskName) {
        console.log('Timer initialized with:', { taskName: eventTaskName, duration: newDuration });
        setInternalMinutes(Math.floor(newDuration / 60));
      }
    });

    return () => unsubscribe();
  }, [taskName, setInternalMinutes]);

  // Handle view state changes
  useEffect(() => {
    const unsubscribeExpand = eventBus.on('timer:expand', ({ taskName: eventTaskName }) => {
      if (eventTaskName === taskName) {
        console.log('Timer expanding view for:', eventTaskName);
        setIsExpanded(true);
      }
    });

    const unsubscribeCollapse = eventBus.on('timer:collapse', ({ taskName: eventTaskName, saveNotes }) => {
      if (eventTaskName === taskName) {
        console.log('Timer collapsing view for:', eventTaskName);
        if (saveNotes && expandedViewRef.current?.saveNotes) {
          expandedViewRef.current.saveNotes();
        }
        setIsExpanded(false);
      }
    });

    return () => {
      unsubscribeExpand();
      unsubscribeCollapse();
    };
  }, [taskName, setIsExpanded]);

  const {
    handleComplete,
    handleAddTimeAndContinue,
    handleToggle: handleTimerToggle,
    handleCloseCompletion,
    handleAddTime,
    handleCloseTimer,
  } = useTimerHandlers({
    taskName,
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
    updateMetrics,
    setPauseTimeLeft,
    pauseTimerRef,
    reset,
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

  // Define auto-complete handler for habit tasks
  const handleAutoComplete = useCallback(async () => {
    if (isRunning) {
      pause();
    }
    
    // Play completion sound
    playSound();
    
    // Prepare completion metrics
    const completionMetrics: TimerStateMetrics = {
      ...metrics,
      estimatedTime: minutes * 60,
      pauseCount: metrics.pauseCount || 0,
      completionStatus: "Completed On Time"
    };
    
    // Mark the timer as complete
    await completeTimer();
    
    // Set completion state for showing completion view
    setCompletionMetrics(completionMetrics);
    setShowCompletion(true);
    
    // Notify the parent component about completion
    if (onComplete) {
      onComplete(completionMetrics);
    }
    
    // Check if this task is tied to a habit
    const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const habitTask = tasks.find((t: any) => t.name === taskName && t.relationships?.habitId);
    
    if (habitTask) {
      // Auto-complete the related habit
      eventBus.emit('task:complete', { 
        taskId: habitTask.id,
        metrics: completionMetrics
      });
    }
  }, [isRunning, pause, playSound, metrics, minutes, timeLeft, completeTimer, onComplete, taskName]);

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
          onClose={() => eventBus.emit('timer:collapse', { taskName, saveNotes: true })}
          onLike={() => {
            const updates: Partial<TimerStateMetrics> = { 
              favoriteQuotes: (metrics.favoriteQuotes || 0) + 1 
            };
            updateMetrics(updates);
          }}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
    </div>
  );
};

Timer.displayName = 'Timer';
