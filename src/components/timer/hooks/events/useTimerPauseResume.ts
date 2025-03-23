
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';
import { EventPayload } from '@/types/events';

interface UseTimerPauseResumeProps {
  taskName: string;
  timeLeftRef: React.MutableRefObject<number>;
  isRunningRef: React.MutableRefObject<boolean>;
  lastTickTimeRef: React.MutableRefObject<number>;
}

/**
 * Hook for handling timer pause and resume functionality
 */
export const useTimerPauseResume = ({
  taskName,
  timeLeftRef,
  isRunningRef,
  lastTickTimeRef,
}: UseTimerPauseResumeProps) => {
  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerPauseResume', `Setting up timer pause/resume event listeners for task: ${taskName}`);
    
    // Handle timer pause - stop the interval
    const unsubPause = eventManager.on('timer:pause', (payload: EventPayload<'timer:pause'>) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerPauseResume', `Pausing timer for ${taskName}, time left: ${timeLeftRef.current}`);
        
        isRunningRef.current = false;
        
        // If the payload contains timeLeft, use it
        if (payload.timeLeft !== undefined) {
          timeLeftRef.current = payload.timeLeft;
        }
        
        // Emit a tick event to ensure UI updates (with throttling)
        const now = Date.now();
        if (now - lastTickTimeRef.current > 1000) {
          lastTickTimeRef.current = now;
          eventManager.emit('timer:tick', {
            timeLeft: timeLeftRef.current,
            taskName
          });
        }
      }
    });
    
    // Handle timer resume - restart the interval with the current time left
    const unsubResume = eventManager.on('timer:resume', (payload: EventPayload<'timer:resume'>) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerPauseResume', `Resuming timer for ${taskName}, time left: ${timeLeftRef.current}`);
        
        isRunningRef.current = true;
        
        // If the payload contains timeLeft, use it
        if (payload.timeLeft !== undefined) {
          timeLeftRef.current = payload.timeLeft;
        }
        
        // Emit a tick event to ensure UI updates (with throttling)
        const now = Date.now();
        if (now - lastTickTimeRef.current > 1000) {
          lastTickTimeRef.current = now;
          eventManager.emit('timer:tick', {
            timeLeft: timeLeftRef.current,
            taskName
          });
        }
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      logger.debug('TimerPauseResume', `Cleaning up timer pause/resume event listeners for task: ${taskName}`);
      unsubPause();
      unsubResume();
    };
  }, [taskName, timeLeftRef, isRunningRef, lastTickTimeRef]);
};
