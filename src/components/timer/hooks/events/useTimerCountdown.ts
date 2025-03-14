
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { logger } from '@/utils/logManager';

interface UseTimerCountdownProps {
  taskName: string;
  setInternalMinutes: (minutes: number) => void;
}

/**
 * Hook for handling timer countdown functionality
 */
export const useTimerCountdown = ({
  taskName,
  setInternalMinutes,
}: UseTimerCountdownProps) => {
  // Add a timer interval ref to clear on unmount
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Store time left for pause/resume functionality
  const timeLeftRef = useRef<number>(0);
  // Track if timer is currently running
  const isRunningRef = useRef<boolean>(false);
  // Track last tick time to prevent recursive ticks
  const lastTickTimeRef = useRef<number>(0);

  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerCountdown', `Setting up timer countdown event listeners for task: ${taskName}`);
    
    // Handle timer start - set up the interval for counting down
    const unsubStart = eventManager.on('timer:start', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerCountdown', `Starting timer for ${taskName} with duration: ${payload.duration}`);
        
        // Clear any existing interval
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        
        // Initialize or use the stored time left
        if (payload.duration !== undefined) {
          timeLeftRef.current = payload.duration;
          const minutes = Math.floor(payload.duration / 60);
          setInternalMinutes(minutes);
        }
        
        isRunningRef.current = true;
        
        // Create new interval for countdown
        timerIntervalRef.current = setInterval(() => {
          if (isRunningRef.current && timeLeftRef.current > 0) {
            timeLeftRef.current -= 1;
            
            // Add throttling to prevent excessive tick events
            const now = Date.now();
            if (now - lastTickTimeRef.current > 1000) { // Only emit at most every second
              lastTickTimeRef.current = now;
              
              // Emit tick event with the new time
              eventManager.emit('timer:tick', {
                taskName,
                remaining: timeLeftRef.current,
                timeLeft: timeLeftRef.current
              });
            }
            
            // Check if timer is complete
            if (timeLeftRef.current <= 0) {
              if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
              }
              isRunningRef.current = false;
              eventManager.emit('timer:complete', { taskName });
            }
          }
        }, 1000);
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      logger.debug('TimerCountdown', `Cleaning up timer countdown event listeners for task: ${taskName}`);
      unsubStart();
      
      // Clear any active timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [taskName, setInternalMinutes]);

  return {
    timeLeftRef,
    isRunningRef,
    lastTickTimeRef
  };
};
