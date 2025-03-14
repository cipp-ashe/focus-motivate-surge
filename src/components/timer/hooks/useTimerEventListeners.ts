
import { useRef, RefObject } from 'react';
import { TimerExpandedViewRef } from '@/types/timer';
import { useTimerEvents } from './events/useTimerEvents';
import { useTimerCountdown } from './events/useTimerCountdown';
import { useTimerPauseResume } from './events/useTimerPauseResume';
import { logger } from '@/utils/logManager';

interface UseTimerEventListenersProps {
  taskName: string;
  setInternalMinutes: (minutes: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  expandedViewRef: RefObject<TimerExpandedViewRef | null>;
}

/**
 * Compose all timer event hooks into a single hook for easier use
 */
export const useTimerEventListeners = ({
  taskName,
  setInternalMinutes,
  setIsExpanded,
  expandedViewRef,
}: UseTimerEventListenersProps) => {
  logger.debug('TimerEventListeners', `Setting up timer event listeners for task: ${taskName}`);
  
  // Set up countdown events (start, tick)
  const { 
    timeLeftRef, 
    isRunningRef,
    lastTickTimeRef 
  } = useTimerCountdown({
    taskName,
    setInternalMinutes,
  });
  
  // Set up pause/resume events
  useTimerPauseResume({
    taskName,
    timeLeftRef,
    isRunningRef,
    lastTickTimeRef,
  });
  
  // Set up expand/collapse events
  useTimerEvents({
    taskName,
    setIsExpanded,
    expandedViewRef,
  });
  
  return {
    timeLeftRef,
    isRunningRef,
    lastTickTimeRef,
  };
};
