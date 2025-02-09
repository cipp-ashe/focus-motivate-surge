
import { useCallback, useRef } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { Minimize2 } from "lucide-react";
import { TIMER_CONSTANTS } from "@/types/timer";
import { CompletionCelebration } from "./CompletionCelebration";
import { FloatingQuotes } from "../quotes/FloatingQuotes";
import { TimerExpandedView, TimerExpandedViewRef } from "./views/TimerExpandedView";
import { TimerCompactView } from "./views/TimerCompactView";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { TimerCompletionDialog, TimerCompletionDialogContent } from "./TimerCompletionDialog";
import { Button } from "../ui/button";
import { useTimerState } from "./state/TimerState";
import { useTimerHandlers } from "./handlers/TimerHandlers";
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

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: TIMER_CONSTANTS.CIRCLE_CIRCUMFERENCE,
    onClick: () => {
      if (isRunning || metrics.isPaused) {
        setIsExpanded(true);
      }
    }
  };

  const timerControlsProps = {
    isRunning,
    onToggle: handleToggle,
    isPaused: metrics.isPaused,
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
    showAddTime: isExpanded,
    size: isExpanded ? "large" as const : "normal" as const,
    pauseTimeLeft,
  };

  if (showCompletion && completionMetrics) {
    return (
      <CompletionCelebration
        metrics={completionMetrics}
        onComplete={handleCloseCompletion}
      />
    );
  }

  return (
    <>
      {isExpanded ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-md transition-opacity duration-300" />
          <FloatingQuotes favorites={favorites} />
          <button
            onClick={handleCloseTimer}
            className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground z-[102] transition-all duration-300 hover:scale-110"
          >
            <Minimize2 className="h-6 w-6" />
          </button>
          <TimerExpandedView
            ref={expandedViewRef}
            taskName={taskName}
            timerCircleProps={timerCircleProps}
            timerControlsProps={{
              ...timerControlsProps,
              size: "large",
              onToggle: () => handleToggle(true)
            }}
            metrics={metrics}
            onClose={handleCloseTimer}
            onLike={() => updateMetrics(prev => ({ favoriteQuotes: prev.favoriteQuotes + 1 }))}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      ) : (
        <TimerCompactView
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={{...timerControlsProps, size: "normal"}}
          metrics={metrics}
          internalMinutes={internalMinutes}
          onMinutesChange={handleMinutesChange}
          selectedSound={selectedSound}
          onSoundChange={setSelectedSound}
          onTestSound={testSound}
          isLoadingAudio={isLoadingAudio}
          onExpand={() => {
            if (isRunning || metrics.isPaused) {
              setIsExpanded(true);
            }
          }}
          onLike={() => updateMetrics(prev => ({ favoriteQuotes: prev.favoriteQuotes + 1 }))}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}

      <div>
        <TimerCompletionDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <TimerCompletionDialogContent>
            <DialogHeader>
              <DialogTitle>Timer Complete</DialogTitle>
              <DialogDescription>
                Are you finished with this task, or would you like to add more time?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleAddTimeAndContinue}
                className="w-full sm:w-auto"
              >
                Add 5 Minutes
              </Button>
              <Button
                onClick={handleComplete}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
              >
                Complete Task
              </Button>
            </DialogFooter>
          </TimerCompletionDialogContent>
        </TimerCompletionDialog>
      </div>
    </>
  );
};

Timer.displayName = 'Timer';
