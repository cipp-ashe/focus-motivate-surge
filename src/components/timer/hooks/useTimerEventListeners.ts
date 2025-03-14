
import { useEffect, RefObject, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TimerExpandedViewRef } from '@/types/timer';
import { logger } from '@/utils/logManager';

interface UseTimerEventListenersProps {
  taskName: string;
  setInternalMinutes: (minutes: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  expandedViewRef: RefObject<TimerExpandedViewRef | null>;
}

export const useTimerEventListeners = ({
  taskName,
  setInternalMinutes,
  setIsExpanded,
  expandedViewRef,
}: UseTimerEventListenersProps) => {
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
    
    logger.debug('TimerEvents', `Setting up timer event listeners for task: ${taskName}`);
    
    // Handle timer initialization
    const unsubInit = eventManager.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Timer init for ${taskName} with duration: ${payload.duration}`);
        timeLeftRef.current = payload.duration;
        const minutes = Math.floor(payload.duration / 60);
        setInternalMinutes(minutes);
      }
    });
    
    // Handle timer expand
    const unsubExpand = eventManager.on('timer:expand', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Expanding timer for ${taskName}`);
        setIsExpanded(true);
      }
    });
    
    // Handle timer collapse
    const unsubCollapse = eventManager.on('timer:collapse', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Collapsing timer for ${taskName}`);
        setIsExpanded(false);
        if (payload.saveNotes && expandedViewRef.current) {
          expandedViewRef.current.saveNotes();
        }
      }
    });
    
    // Handle timer start - set up the interval for counting down
    const unsubStart = eventManager.on('timer:start', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Starting timer for ${taskName} with duration: ${payload.duration}`);
        
        // Clear any existing interval
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        
        // Initialize or use the stored time left
        if (payload.duration !== undefined) {
          timeLeftRef.current = payload.duration;
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
    
    // Handle timer pause - stop the interval
    const unsubPause = eventManager.on('timer:pause', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Pausing timer for ${taskName}, time left: ${timeLeftRef.current}`);
        
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
            taskName,
            remaining: timeLeftRef.current,
            timeLeft: timeLeftRef.current
          });
        }
      }
    });
    
    // Handle timer resume - restart the interval with the current time left
    const unsubResume = eventManager.on('timer:resume', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Resuming timer for ${taskName}, time left: ${timeLeftRef.current}`);
        
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
            taskName,
            remaining: timeLeftRef.current,
            timeLeft: timeLeftRef.current
          });
        }
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      logger.debug('TimerEvents', `Cleaning up timer event listeners for task: ${taskName}`);
      unsubInit();
      unsubExpand();
      unsubCollapse();
      unsubStart();
      unsubPause();
      unsubResume();
      
      // Clear any active timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [taskName, setInternalMinutes, setIsExpanded, expandedViewRef]);
};
