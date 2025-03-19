
import { useRef } from "react";
import { useTimerActions } from '@/hooks/timer/useTimerActions';
import { TimerStateMetrics } from "@/types/metrics";
import { TimerActionProps } from "@/hooks/timer/types/UseTimerTypes";
import { eventManager } from "@/lib/events/EventManager";
import { logger } from "@/utils/logManager";

interface UseTimerActionsProps {
  timeLeft: number;
  metrics: TimerStateMetrics;
  updateTimeLeft: (timeLeft: number) => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  setIsRunning: (isRunning: boolean) => void;
  taskName: string;
}

export const useTimerActions = ({
  timeLeft,
  metrics,
  updateTimeLeft,
  updateMetrics,
  setIsRunning,
  taskName
}: UseTimerActionsProps) => {
  // Ref for pause timer
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
      duration: timeLeft
    });
    
    // Also dispatch a window event for backward compatibility
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('timer:start', { 
        detail: { 
          taskName,
          duration: timeLeft
        } 
      });
      window.dispatchEvent(event);
    }
  };

  return {
    pauseTimerRef,
    startTimer: wrappedStartTimer,
    pauseTimer,
    extendTimer,
    resetTimer,
    completeTimerAction,
    updateMetricsAction
  };
};
