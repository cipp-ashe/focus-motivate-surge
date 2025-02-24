
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { SoundOption, TimerProps } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { useTimer } from "@/hooks/timer/useTimer";
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

  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    start: timerStart,
    pause: timerPause,
    reset: timerReset,
    addTime: timerAddTime,
    setMinutes: timerSetMinutes,
    completeTimer: timerComplete,
    updateMetrics: timerUpdateMetrics,
  } = useTimer({
    initialDuration: durationInSeconds,
    onTimeUp: handleTimeUp,
    onDurationChange,
  });

  // Event handlers
  const start = useCallback(() => {
    timerStart();
    eventBus.emit('timer:start', { 
      taskName, 
      duration: durationInSeconds,
      currentTime: timeLeft 
    });
  }, [timerStart, taskName, durationInSeconds, timeLeft]);

  const pause = useCallback(() => {
    timerPause();
    eventBus.emit('timer:pause', { 
      taskName, 
      timeLeft,
      metrics 
    });
  }, [timerPause, taskName, timeLeft, metrics]);

  const reset = useCallback(() => {
    timerReset();
    eventBus.emit('timer:reset', { 
      taskName, 
      duration: durationInSeconds 
    });
  }, [timerReset, taskName, durationInSeconds]);

  const addTime = useCallback((minutes: number) => {
    timerAddTime(minutes);
    if (onAddTime) onAddTime();
  }, [timerAddTime, onAddTime]);

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
    setMinutes: timerSetMinutes,
    completeTimer,
    updateMetrics,

    // Audio
    playSound,
    testSound,
    isLoadingAudio,
  };
};
