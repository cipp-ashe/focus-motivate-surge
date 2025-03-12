
import React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import type { TimerProps } from "@/types/timer";
import { TimerError } from "./TimerError";
import { TimerContent } from "./TimerContent";
import { useTimerInitialization } from "./hooks/useTimerInitialization";

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

  try {
    const {
      // Refs
      expandedViewRef,
      
      // State
      isExpanded,
      selectedSound,
      setSelectedSound,
      showCompletion,
      showConfirmation,
      setShowConfirmation,
      completionMetrics,
      internalMinutes,
      setInternalMinutes,
      metrics,
      
      // Handlers
      timerHandlers,
      
      // Props generators
      getTimerCircleProps,
      getTimerControlsProps,
      
      // Utility functions
      testSound,
      updateMetrics,
      isLoadingAudio,
    } = useTimerInitialization({
      duration,
      taskName,
      onComplete,
      onAddTime,
      onDurationChange,
    });

    const timerCircleProps = getTimerCircleProps();
    const timerControlsProps = getTimerControlsProps();

    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerContent
          showCompletion={showCompletion}
          completionMetrics={completionMetrics}
          handleCloseCompletion={timerHandlers.handleCloseCompletion}
          isExpanded={isExpanded}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={timerControlsProps}
          metrics={metrics}
          internalMinutes={internalMinutes}
          setInternalMinutes={setInternalMinutes}
          selectedSound={selectedSound}
          setSelectedSound={setSelectedSound}
          testSound={testSound}
          isLoadingAudio={isLoadingAudio}
          updateMetrics={updateMetrics}
          expandedViewRef={expandedViewRef}
          handleCloseTimer={timerHandlers.handleCloseTimer}
          favorites={favorites}
          setFavorites={setFavorites}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          handleAddTimeAndContinue={timerHandlers.handleAddTimeAndContinue}
          handleComplete={timerHandlers.handleComplete}
        />
      </Card>
    );
    
  } catch (error) {
    console.error("Error in Timer component:", error);
    toast.error("Could not initialize timer");
    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerError />
      </Card>
    );
  }
};

Timer.displayName = 'Timer';
