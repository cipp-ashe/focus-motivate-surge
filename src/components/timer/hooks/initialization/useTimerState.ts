
import { useState } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { SoundOption } from "@/types/timer";
import { useTimerState } from "@/hooks/timer/useTimerState";

interface TimerStateReturn {
  timerState: {
    timeLeft: number;
    minutes: number;
    isRunning: boolean;
    metrics: TimerStateMetrics;
    isMountedRef: React.MutableRefObject<boolean>;
  };
  updateTimeLeft: (newTimeLeft: number) => void;
  updateMinutes: (newMinutes: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  viewState: {
    isExpanded: boolean;
    selectedSound: SoundOption;
    showCompletion: boolean;
    showConfirmation: boolean;
    completionMetrics: any;
    internalMinutes: number;
    pauseTimeLeft: number | null;
    isLoadingAudio: boolean;
  };
  setIsExpanded: (expanded: boolean) => void;
  setSelectedSound: (sound: SoundOption) => void;
  setShowCompletion: (show: boolean) => void;
  setShowConfirmation: (show: boolean) => void;
  setCompletionMetrics: (metrics: any) => void;
  setInternalMinutes: (minutes: number) => void;
  setPauseTimeLeft: (timeLeft: number | null) => void;
  setIsLoadingAudio: (loading: boolean) => void;
}

export const useTimerState = (duration: number): TimerStateReturn => {
  // Initialize the timer state
  const {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    isMountedRef,
  } = useTimerState(duration);

  // Initialize view state separately
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>('bell');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState(null);
  const [internalMinutes, setInternalMinutes] = useState(Math.floor(duration / 60));
  const [pauseTimeLeft, setPauseTimeLeft] = useState<number | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  return {
    timerState: {
      timeLeft,
      minutes,
      isRunning,
      metrics,
      isMountedRef
    },
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    viewState: {
      isExpanded,
      selectedSound,
      showCompletion,
      showConfirmation,
      completionMetrics,
      internalMinutes,
      pauseTimeLeft,
      isLoadingAudio
    },
    setIsExpanded,
    setSelectedSound,
    setShowCompletion,
    setShowConfirmation,
    setCompletionMetrics,
    setInternalMinutes,
    setPauseTimeLeft,
    setIsLoadingAudio
  };
};
