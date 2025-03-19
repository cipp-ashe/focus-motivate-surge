
import { useState } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { SoundOption } from "@/types/timer";
import { useTimerState as useBaseTimerState } from "@/hooks/timer/useTimerState";

interface TimerViewState {
  isExpanded: boolean;
  selectedSound: SoundOption;
  showCompletion: boolean;
  showConfirmation: boolean;
  completionMetrics: any;
  internalMinutes: number;
  pauseTimeLeft: number | null;
  isLoadingAudio: boolean;
}

interface TimerInitState {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerStateMetrics;
  isMountedRef: React.MutableRefObject<boolean>;
}

export const useTimerState = (duration: number) => {
  // Initialize the base timer state
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
  } = useBaseTimerState(duration);

  // Initialize view state separately
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundOption>('bell');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState(null);
  const [internalMinutes, setInternalMinutes] = useState(Math.floor(duration / 60));
  const [pauseTimeLeft, setPauseTimeLeft] = useState<number | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const timerState: TimerInitState = {
    timeLeft,
    minutes,
    isRunning,
    metrics,
    isMountedRef
  };

  const viewState: TimerViewState = {
    isExpanded,
    selectedSound,
    showCompletion,
    showConfirmation,
    completionMetrics,
    internalMinutes,
    pauseTimeLeft,
    isLoadingAudio
  };

  return {
    timerState,
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    viewState,
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
