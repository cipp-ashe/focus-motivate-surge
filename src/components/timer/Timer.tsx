import { useState, useCallback } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useTimerState } from "@/hooks/useTimerState";
import { TimerStateMetrics } from "@/types/metrics";
import { CompletionCelebration } from "./CompletionCelebration";
import { FloatingQuotes } from "../FloatingQuotes";
import { Minimize2 } from "lucide-react";
import { TIMER_CONSTANTS, SOUND_OPTIONS, type SoundOption, type TimerProps } from "@/types/timer";
import { TimerExpandedView } from "./views/TimerExpandedView";
import { TimerCompactView } from "./views/TimerCompactView";
import { toast } from "sonner";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { TimerCompletionDialog, TimerCompletionDialogContent } from "./TimerCompletionDialog";
import { Button } from "../ui/button";

const { MIN_MINUTES, MAX_MINUTES, ADD_TIME_MINUTES, CIRCLE_CIRCUMFERENCE } = TIMER_CONSTANTS;

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites
}: TimerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>("bell");
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState<TimerStateMetrics | null>(null);
  const initialMinutes = duration ? Math.floor(duration / 60) : 25;
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

  // Convert minutes to seconds for timer state
  const durationInSeconds = internalMinutes * 60;

  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start,
    pause,
    incrementFavorites,
    addTime: addMinutes,
    setMinutes,
    completeTimer,
    reset: resetTimer,
  } = useTimerState({
    initialDuration: durationInSeconds,
    onTimeUp: async () => {
      try {
        pause();
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error in timer completion flow:', error);
        toast.error("An error occurred while completing the timer");
      }
    },
    onDurationChange,
  });

  const handleTimerCompletion = useCallback(async () => {
    try {
      const finalMetrics = await completeTimer();
      if (!finalMetrics) {
        toast.error("An error occurred while completing the timer");
        return;
      }
      await playSound();
      setTimeout(() => {
        setCompletionMetrics(finalMetrics);
        setShowCompletion(true);
      }, 0);
    } catch (error) {
      console.error('Error in timer completion flow:', error);
      toast.error("An error occurred while completing the timer");
    }
  }, [completeTimer, playSound]);

  const handleComplete = useCallback(async () => {
    setShowConfirmation(false);
    await handleTimerCompletion();
  }, [handleTimerCompletion]);

  const handleAddTimeAndContinue = useCallback(() => {
    setShowConfirmation(false);
    addMinutes(ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    start();
    toast(`Added ${ADD_TIME_MINUTES} minutes. Keep going! 💪`);
  }, [addMinutes, onAddTime, start]);

  const handleMinutesChange = useCallback((newMinutes: number) => {
    setInternalMinutes(newMinutes);
    setMinutes(newMinutes);
  }, [setMinutes]);

  const handleStart = useCallback(() => {
    start();
    setIsExpanded(true);
  }, [start]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleToggle = useCallback(() => {
    if (isRunning) {
      handlePause();
    } else {
      handleStart();
    }
  }, [isRunning, handlePause, handleStart]);

  const handleCloseCompletion = useCallback(() => {
    if (!completionMetrics) return;
    
    if (typeof onComplete === 'function') {
      onComplete(completionMetrics);
    }
    
    setShowCompletion(false);
    setIsExpanded(false);
    setCompletionMetrics(null);
    resetTimer();
    
    toast("Task completed! You're crushing it! 🎉");
  }, [onComplete, completionMetrics, resetTimer]);

  const handleAddTime = useCallback(() => {
    addMinutes(ADD_TIME_MINUTES);
    if (typeof onAddTime === 'function') {
      onAddTime();
    }
    toast(`Added ${ADD_TIME_MINUTES} minutes. Keep going! 💪`);
  }, [addMinutes, onAddTime]);

  const handleCloseTimer = useCallback(() => {
    if (!showCompletion) {
      setIsExpanded(false);
    }
  }, [showCompletion]);

  const timerCircleProps = {
    isRunning,
    timeLeft,
    minutes,
    circumference: CIRCLE_CIRCUMFERENCE,
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
  };

  if (showCompletion && completionMetrics) {
    return (
      <CompletionCelebration
        show={showCompletion}
        metrics={completionMetrics}
        taskName={taskName}
        onClose={handleCloseCompletion}
        width={window.innerWidth}
        height={window.innerHeight}
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
            taskName={taskName}
            timerCircleProps={timerCircleProps}
            timerControlsProps={{...timerControlsProps, size: "large"}}
            metrics={metrics}
            onClose={handleCloseTimer}
            onLike={incrementFavorites}
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
          onExpand={() => isRunning && setIsExpanded(true)}
          onLike={incrementFavorites}
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