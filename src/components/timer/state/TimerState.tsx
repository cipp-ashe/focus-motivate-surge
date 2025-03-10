
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { SoundOption, TimerProps } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { useTimer } from "@/hooks/timer/useTimer";
import { useTimerActions } from "@/hooks/timer/useTimerActions";
import { useAudio } from "@/hooks/useAudio";
import { toast } from "sonner";
import { TIMER_CONSTANTS, SOUND_OPTIONS } from "@/types/timer";
import { eventBus } from "@/lib/eventBus";

export const useTimerState = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
}: Pick<TimerProps, "duration" | "taskName" | "onComplete" | "onAddTime" | "onDurationChange">) => {
  // View state
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>("bell");
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState<TimerStateMetrics | null>(null);
  
  // Timer state
  const [internalMinutes, setInternalMinutes] = useState(duration ? Math.floor(duration / 60) : 25);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(0);
  const pauseTimerRef = useRef<NodeJS.Timeout>();

  // Memoized calculations
  const durationInSeconds = useMemo(() => internalMinutes * 60, [internalMinutes]);

  const handleTimeUp = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const { state, dispatch, timeLeft, minutes, isRunning, metrics } = useTimer({
    initialMinutes: Math.floor(durationInSeconds / 60),
    onTimeUp: handleTimeUp
  });

  const {
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    completeTimer: timerComplete,
    updateMetrics: timerUpdateMetrics,
  } = useTimerActions(state, dispatch);

  // Event handlers
  const start = useCallback(() => {
    startTimer();
    eventBus.emit('timer:start', { 
      taskName, 
      duration: durationInSeconds,
      currentTime: timeLeft 
    });
  }, [startTimer, taskName, durationInSeconds, timeLeft]);

  const pause = useCallback(() => {
    pauseTimer();
    eventBus.emit('timer:pause', { 
      taskName, 
      timeLeft,
      metrics 
    });
  }, [pauseTimer, taskName, timeLeft, metrics]);

  const reset = useCallback(() => {
    resetTimer();
    eventBus.emit('timer:reset', { 
      taskName, 
      duration: durationInSeconds 
    });
  }, [resetTimer, taskName, durationInSeconds]);

  const addTime = useCallback((minutes: number) => {
    extendTimer(minutes);
    if (onAddTime) onAddTime();
  }, [extendTimer, onAddTime]);

  const setMinutes = useCallback((mins: number) => {
    setInternalMinutes(mins);
    if (onDurationChange) onDurationChange(mins);
  }, [setInternalMinutes, onDurationChange]);

  const completeTimer = useCallback(async () => {
    await timerComplete();
    eventBus.emit('timer:complete', { 
      taskName, 
      metrics 
    });
    if (onComplete) onComplete(metrics);
  }, [timerComplete, taskName, metrics, onComplete]);

  const updateMetrics = useCallback((updates: Partial<TimerStateMetrics>) => {
    timerUpdateMetrics(updates);
    eventBus.emit('timer:metrics-update', { 
      taskName,
      metrics: updates 
    });
  }, [timerUpdateMetrics, taskName]);

  // Audio setup
  const { play: playSound, testSound, isLoadingAudio } = useAudio({
    audioUrl: useMemo(() => SOUND_OPTIONS[selectedSound], [selectedSound]),
    options: {
      onError: useCallback((error) => {
        console.error("Audio error:", error);
        toast.error("Could not play sound. Please check your browser settings. 🔇");
      }, []),
    },
  });

  // Emit state updates
  useEffect(() => {
    eventBus.emit('timer:state-update', {
      taskName,
      timeLeft,
      isRunning,
      metrics
    });
  }, [taskName, timeLeft, isRunning, metrics]);

  return {
    // View state
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

    // Timer state
    internalMinutes,
    setInternalMinutes,
    pauseTimeLeft,
    setPauseTimeLeft,
    pauseTimerRef,
    timeLeft,
    minutes,
    isRunning,
    metrics,

    // Actions
    start,
    pause,
    reset,
    addTime,
    setMinutes,
    completeTimer,
    updateMetrics,

    // Audio
    playSound,
    testSound,
    isLoadingAudio,
  };
};
