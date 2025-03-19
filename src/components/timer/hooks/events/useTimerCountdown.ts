
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
  // Create refs to track timer state
  const timeLeftRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const lastTickTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerCountdown', `Setting up timer countdown event listeners for task: ${taskName}`);
    
    // Handle timer start
    const unsubStart = eventManager.on('timer:start', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerCountdown', `Starting timer for ${taskName}, duration: ${payload.duration}`);
        
        timeLeftRef.current = payload.duration;
        isRunningRef.current = true;
        setInternalMinutes(Math.floor(payload.duration / 60));
        
        // Emit a tick event
        lastTickTimeRef.current = Date.now();
        eventManager.emit('timer:tick', {
          timeLeft: timeLeftRef.current,
          taskName
        });
      }
    });
    
    // Handle timer tick - update time left
    const unsubTick = eventManager.on('timer:tick', (payload) => {
      if (payload.taskName === taskName || payload.taskName === 'timer') {
        // Use either timeLeft or remaining (for backward compatibility)
        const newTimeLeft = payload.timeLeft !== undefined ? payload.timeLeft : payload.remaining;
        
        if (newTimeLeft !== undefined) {
          logger.debug('TimerCountdown', `Timer tick for ${taskName}: ${newTimeLeft}s remaining`);
          timeLeftRef.current = newTimeLeft;
          setInternalMinutes(Math.floor(newTimeLeft / 60));
        }
      }
    });
    
    // Also listen for window timer tick events
    const handleWindowTick = (e: CustomEvent<any>) => {
      if (e.detail && e.detail.timeLeft !== undefined && isRunningRef.current) {
        logger.debug('TimerCountdown', `Window timer tick for ${taskName}: ${e.detail.timeLeft}s remaining`);
        timeLeftRef.current = e.detail.timeLeft;
        setInternalMinutes(Math.floor(e.detail.timeLeft / 60));
      }
    };
    
    window.addEventListener('timer:tick', handleWindowTick as EventListener);
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      logger.debug('TimerCountdown', `Cleaning up timer countdown event listeners for task: ${taskName}`);
      unsubStart();
      unsubTick();
      window.removeEventListener('timer:tick', handleWindowTick as EventListener);
    };
  }, [taskName, setInternalMinutes]);
  
  return { 
    timeLeftRef, 
    isRunningRef,
    lastTickTimeRef 
  };
};
