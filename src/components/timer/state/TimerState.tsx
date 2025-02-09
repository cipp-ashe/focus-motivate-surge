
import { useState, useCallback } from "react";
import { SoundOption, TimerProps } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { useTimer } from "@/hooks/timer/useTimer";
import { useAudio } from "@/hooks/useAudio";
import { toast } from "sonner";
import { TIMER_CONSTANTS, SOUND_OPTIONS } from "@/types/timer";

export const useTimerState = ({
  duration,
  onComplete,
  onAddTime,
  onDurationChange,
}: Pick<TimerProps, "duration" | "onComplete" | "onAddTime" | "onDurationChange">) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>("bell");
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState<TimerStateMetrics | null>(null);
  const [internalMinutes, setInternalMinutes] = useState(duration ? Math.floor(duration / 60) : 25);
  const [pauseTimeLeft, setPauseTimeLeft] = useState(0);
  const pauseTimerRef = useRef<NodeJS.Timeout>();
  const durationInSeconds = internalMinutes * 60;

  const {
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
  } = useTimer({
    initialDuration: durationInSeconds,
    onTimeUp: async () => {
      try {
        pause();
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error in timer completion flow:', error);
        toast.error("An error occurred while completing the timer ⚠️");
      }
    },
    onDurationChange,
  });

  const { play: playSound, testSound, isLoadingAudio } = useAudio({
    audioUrl: SOUND_OPTIONS[selectedSound],
    options: {
      onError: (error) => {
        console.error("Audio error:", error);
        toast.error("Could not play sound. Please check your browser settings. 🔇");
      },
    },
  });

  return {
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
  };
};
