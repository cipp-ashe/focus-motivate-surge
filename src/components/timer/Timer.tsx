import { useState, useCallback, useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { useTimerState } from "@/hooks/useTimerState";
import { useTimerEffects } from "@/hooks/useTimerEffects";
import { useTransition } from "@/hooks/useTransition";
import { useWindowSize } from "@/hooks/useWindowSize";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "../TimerControls";
import { TimerMetricsDisplay } from "./TimerMetrics";
import { TimerHeader } from "./TimerHeader";
import { CompletionCelebration } from "./CompletionCelebration";
import { SoundSelector } from "../SoundSelector";
import { MinutesInput } from "../MinutesInput";
import { QuoteDisplay } from "../QuoteDisplay";
import { FloatingQuotes } from "../FloatingQuotes";
import { Card } from "../ui/card";
import { Minimize2 } from "lucide-react";
import { TIMER_CONSTANTS, SOUND_OPTIONS, type SoundOption, type TimerProps } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { focusOrder, useFocusTrap } from "@/hooks/useFocusTrap";
import { toast } from "sonner";

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
  const [completionMetrics, setCompletionMetrics] = useState<TimerStateMetrics | null>(null);
  const initialMinutes = duration ? Math.floor(duration / 60) : 25;
  const [internalMinutes, setInternalMinutes] = useState(initialMinutes);
  const windowSize = useWindowSize();

  const { containerRef: focusRef } = useFocusTrap({
    enabled: !isExpanded,
  });

  const { play: playSound, testSound, isLoadingAudio } = useAudio({
    audioUrl: SOUND_OPTIONS[selectedSound],
    options: {
      onError: (error) => {
        console.error("Audio error:", error);
        toast.error("Could not play sound. Please check your browser settings.");
      },
    },
  });

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
    initialDuration: internalMinutes * 60,
    onTimeUp: async () => {
      try {
        // First complete the timer to finalize metrics
        const finalMetrics = await completeTimer();
        console.debug('Timer completed with metrics:', finalMetrics);
        
        if (!finalMetrics) {
          console.error('No metrics returned from completeTimer');
          return;
        }
        
        // Then play sound and show completion with the finalized metrics
        await playSound();
        handleTimerCompletion(finalMetrics);
      } catch (error) {
        console.error('Error completing timer:', error);
      }
    },
    onDurationChange: onDurationChange || (() => {}),
  });

  const handleTimerCompletion = useCallback((currentMetrics: TimerStateMetrics) => {
    console.debug('Timer completion flow - Starting:', {
      currentMetrics,
      isRunning,
      taskName
    });

    if (!currentMetrics.endTime) {
      console.warn('Timer completion called but metrics not finalized', { metrics: currentMetrics });
      return;
    }

    // Use setTimeout to ensure state updates are complete
    setTimeout(() => {
      setCompletionMetrics(currentMetrics);
      setShowCompletion(true);
    }, 0);
  }, [isRunning, taskName]);

  useEffect(() => {
    if (!isRunning) {
      const newMinutes = Math.floor(duration / 60);
      setInternalMinutes(newMinutes);
      setMinutes(newMinutes);
    }
  }, [duration, taskName, isRunning, setMinutes]);

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

  const handleComplete = useCallback(async () => {
    try {
      // First complete the timer to finalize metrics
      const finalMetrics = await completeTimer();
      console.debug('Manual completion with metrics:', finalMetrics);
      
      if (!finalMetrics) {
        console.error('No metrics returned from completeTimer');
        return;
      }
      
      // Then play sound and show completion with the finalized metrics
      await playSound();
      handleTimerCompletion(finalMetrics);
    } catch (error) {
      console.error('Error completing timer:', error);
    }
  }, [completeTimer, playSound, handleTimerCompletion]);

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
    onComplete: handleComplete,
    onAddTime: handleAddTime,
    metrics,
    showAddTime: isExpanded,
    size: isExpanded ? "large" as const : "normal" as const,
  };

  return (
    <>
      {!showCompletion && (
        isExpanded ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md transition-opacity duration-300" />

            <FloatingQuotes favorites={favorites} />

            <button
              onClick={handleCloseTimer}
              className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground z-[102] transition-all duration-300 hover:scale-110"
            >
              <Minimize2 className="h-6 w-6" />
            </button>

            <div className="relative w-full max-w-[600px] mx-auto px-4 py-8 z-[101]">
              <Card className="w-full bg-card/90 backdrop-blur-md shadow-lg p-6 sm:p-8 border-primary/20">
                <div className="space-y-8 sm:space-y-12">
                  <TimerHeader taskName={taskName} />
                  
                  <div className="flex flex-col items-center gap-8 sm:gap-12">
                    <div className="scale-110 sm:scale-125 transform-gpu">
                      <TimerDisplay
                        circleProps={timerCircleProps}
                        size="large"
                        isRunning={isRunning}
                      />
                    </div>

                    <div className="w-full max-w-md px-4">
                      <TimerControls {...timerControlsProps} />
                      <TimerMetricsDisplay 
                        metrics={metrics}
                        isRunning={isRunning}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-8">
                <QuoteDisplay 
                  showAsOverlay
                  currentTask={taskName}
                  onLike={() => incrementFavorites()}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <Card 
              ref={focusRef}
              className="w-full max-w-[600px] mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-4 sm:p-6"
            >
              <div className="space-y-4 sm:space-y-6">
                <TimerHeader taskName={taskName} />

                <div className={`overflow-hidden transition-all duration-700 ${
                  isRunning ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
                }`}>
                  <div className="flex flex-col items-center space-y-4 pt-2">
                    <MinutesInput
                      minutes={internalMinutes}
                      onMinutesChange={handleMinutesChange}
                      minMinutes={MIN_MINUTES}
                      maxMinutes={MAX_MINUTES}
                    />

                    <SoundSelector
                      selectedSound={selectedSound}
                      onSoundChange={setSelectedSound}
                      onTestSound={testSound}
                      isLoadingAudio={isLoadingAudio}
                    />
                  </div>
                </div>

                <TimerDisplay
                  circleProps={timerCircleProps}
                  size="normal"
                  onClick={() => isRunning && setIsExpanded(true)}
                  isRunning={isRunning}
                />

                <TimerControls {...timerControlsProps} />

                <TimerMetricsDisplay
                  metrics={metrics}
                  isRunning={isRunning}
                />

                <QuoteDisplay
                  currentTask={taskName}
                  onLike={() => incrementFavorites()}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </div>
            </Card>
          </div>
        )
      )}
      {completionMetrics && (
        <CompletionCelebration
          show={showCompletion}
          metrics={completionMetrics}
          taskName={taskName}
          onClose={handleCloseCompletion}
          width={windowSize.width}
          height={windowSize.height}
        />
      )}
    </>
  );
};

Timer.displayName = 'Timer';