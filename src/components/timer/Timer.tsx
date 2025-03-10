
import React, { useState, useRef } from "react";
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
import { useTimerEventListeners } from "./hooks/useTimerEventListeners";
import { useAutoComplete } from "./hooks/useAutoComplete";
import { TimerRenderer } from "./views/TimerRenderer";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer as TimerIcon } from "lucide-react";

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

  // Use useRef to create a proper ref object for the expanded view
  const expandedViewRef = useRef<TimerExpandedViewRef | null>(null);

  try {
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

    // Set up event listeners
    useTimerEventListeners({
      taskName,
      setInternalMinutes,
      setIsExpanded,
      expandedViewRef,
    });

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

    // Handle auto-completion
    const handleAutoComplete = useAutoComplete({
      isRunning,
      pause,
      playSound,
      metrics,
      completeTimer,
      onComplete,
      taskName,
      setCompletionMetrics,
      setShowCompletion,
    });

    // Show completion view if timer is complete
    if (showCompletion && completionMetrics) {
      return (
        <Card className="shadow-md border-border/20 overflow-hidden">
          <CardHeader className="bg-card/70 border-b border-border/10 py-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
              <TimerIcon className="h-5 w-5 text-purple-400" />
              Timer Complete
            </CardTitle>
          </CardHeader>
          <CompletionView metrics={completionMetrics} onComplete={handleCloseCompletion} />
        </Card>
      );
    }

    const timerCircleProps = getTimerCircleProps();
    const timerControlsProps = getTimerControlsProps();

    return (
      <>
        <CardHeader className="bg-card/70 border-b border-border/10 py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer
          </CardTitle>
        </CardHeader>
        <TimerRenderer
          isExpanded={isExpanded}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={timerControlsProps}
          metrics={metrics}
          showCompletion={showCompletion}
          internalMinutes={internalMinutes}
          setInternalMinutes={setInternalMinutes}
          selectedSound={selectedSound}
          setSelectedSound={setSelectedSound}
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
    
  } catch (error) {
    console.error("Error in Timer component:", error);
    toast.error("Could not initialize timer");
    return (
      <>
        <CardHeader className="bg-card/70 border-b border-border/10 py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer Error
          </CardTitle>
        </CardHeader>
        <div className="p-8 text-center">
          <p className="text-destructive">There was an error loading the timer.</p>
        </div>
      </>
    );
  }
};

Timer.displayName = 'Timer';
