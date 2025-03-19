
import { useState, useRef } from "react";
import { TimerExpandedViewRef } from "@/types/timer";
import { useTimerState } from "@/hooks/timer/useTimerState";
import { useTimerActions } from '@/hooks/timer/useTimerActions';
import { TimerActionProps } from "@/hooks/timer/types/UseTimerTypes";
import { logger } from "@/utils/logManager";
import { eventManager } from "@/lib/events/EventManager";

export const useTimerCore = (duration: number, taskName: string) => {
  // Create a ref for the expanded view
  const expandedViewRef = useRef<TimerExpandedViewRef | null>(null);

  // Initialize the timer state
  const timerState = useTimerState(duration);
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
  } = timerState;

  // Initialize view state separately
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'bell' | 'chime' | 'ding' | 'none'>('bell');
  const [showCompletion, setShowCompletion] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completionMetrics, setCompletionMetrics] = useState(null);
  const [internalMinutes, setInternalMinutes] = useState(Math.floor(duration / 60));
  const [pauseTimeLeft, setPauseTimeLeft] = useState<number | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Import timer action hooks with the legacy interface
  const timerActionProps: TimerActionProps = {
    timeLeft, 
    metrics, 
    updateTimeLeft, 
    updateMetrics, 
    setIsRunning 
  };
  
  const { 
    startTimer, 
    pauseTimer, 
    extendTimer, 
    resetTimer, 
    completeTimer: completeTimerAction,
    updateMetrics: updateMetricsAction
  } = useTimerActions(timerActionProps);

  // Add additional effect to emit timer:start event when timer starts
  const wrappedStartTimer = () => {
    logger.debug('TimerCore', `Starting fresh timer for ${taskName} with duration: ${timeLeft}`);
    
    // Start the timer first
    startTimer();
    
    // Then emit the event
    eventManager.emit('timer:start', {
      taskName,
      duration: timeLeft,
      currentTime: Date.now()
    });
    
    // Also dispatch a window event for backward compatibility
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('timer:start', { 
        detail: { 
          taskName,
          duration: timeLeft,
          currentTime: Date.now()
        } 
      });
      window.dispatchEvent(event);
    }
  };

  // Add audio functionality
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const testSound = () => {
    logger.debug('TimerAudio', `Testing sound: ${selectedSound}`);
    setIsLoadingAudio(true);
    // Play the actual sound
    playSound();
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoadingAudio(false);
    }, 500);
  };
  
  const playSound = () => {
    if (selectedSound === 'none') return;
    
    logger.debug('TimerAudio', `Playing completion sound: ${selectedSound}`);
    try {
      // Create an audio element and play the selected sound
      // Use a fully qualified URL to ensure the sound can be found
      const soundUrl = `${window.location.origin}/sounds/${selectedSound}.mp3`;
      const audio = new Audio(soundUrl);
      audio.volume = 0.7;
      
      // Add error handling for better debugging
      audio.addEventListener('error', (e) => {
        console.error('Error playing sound:', e);
        logger.error('TimerAudio', `Failed to load sound: ${soundUrl}`, e);
      });
      
      // Add success logging
      audio.addEventListener('canplaythrough', () => {
        logger.debug('TimerAudio', `Successfully loaded sound: ${soundUrl}`);
      });
      
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
        logger.error('TimerAudio', `Error playing sound: ${error.message}`);
      });
    } catch (error) {
      console.error('Error creating audio element:', error);
      logger.error('TimerAudio', `Error creating audio element: ${error}`);
    }
  };

  return {
    // Refs
    expandedViewRef,
    pauseTimerRef,
    
    // State getters
    timerState: {
      timeLeft,
      minutes,
      isRunning,
      metrics,
      isMountedRef
    },
    
    // State setters
    updateTimeLeft,
    updateMinutes,
    setIsRunning,
    updateMetrics,
    
    // View state
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
    
    // View state setters
    setIsExpanded,
    setSelectedSound,
    setShowCompletion,
    setShowConfirmation,
    setCompletionMetrics,
    setInternalMinutes,
    setPauseTimeLeft,
    setIsLoadingAudio,
    
    // Timer actions
    timerActions: {
      startTimer: wrappedStartTimer,  // Use the wrapped version that emits events
      pauseTimer,
      extendTimer,
      resetTimer,
      completeTimerAction,
      updateMetricsAction
    },
    
    // Audio functions
    audioFunctions: {
      testSound,
      playSound
    }
  };
};
