
import { useEffect, RefObject, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TimerExpandedViewRef } from '@/types/timer';

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
  // Maintain event IDs for debugging
  const eventIdsRef = useRef<{[key: string]: string}>({});
  // Add a timer interval ref to clear on unmount
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Store time left for pause/resume functionality
  const timeLeftRef = useRef<number>(0);
  // Track if timer is currently running
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    console.log(`Setting up timer event listeners for task: ${taskName}`);
    
    // Generate unique IDs for each event listener for debugging
    const initId = `timer:init:${taskName}:${Date.now()}`;
    const expandId = `timer:expand:${taskName}:${Date.now()}`;
    const collapseId = `timer:collapse:${taskName}:${Date.now()}`;
    const startId = `timer:start:${taskName}:${Date.now()}`;
    const pauseId = `timer:pause:${taskName}:${Date.now()}`;
    const resumeId = `timer:resume:${taskName}:${Date.now()}`;
    const tickId = `timer:tick:${taskName}:${Date.now()}`;
    
    eventIdsRef.current = { initId, expandId, collapseId, startId, pauseId, resumeId, tickId };
    
    // Handle timer initialization
    const unsubInit = eventManager.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Timer init for ${taskName} with duration: ${payload.duration} [${initId}]`);
        timeLeftRef.current = payload.duration;
        const minutes = Math.floor(payload.duration / 60);
        setInternalMinutes(minutes);
      }
    });
    
    // Handle timer expand
    const unsubExpand = eventManager.on('timer:expand', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Expanding timer for ${taskName} [${expandId}]`);
        setIsExpanded(true);
      }
    });
    
    // Handle timer collapse
    const unsubCollapse = eventManager.on('timer:collapse', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Collapsing timer for ${taskName} [${collapseId}]`);
        setIsExpanded(false);
        if (payload.saveNotes && expandedViewRef.current) {
          expandedViewRef.current.saveNotes();
        }
      }
    });
    
    // Handle timer start - set up the interval for counting down
    const unsubStart = eventManager.on('timer:start', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Starting timer for ${taskName} with duration: ${payload.duration} [${startId}]`);
        
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
            
            // Emit tick event with the new time
            eventManager.emit('timer:tick', {
              taskName,
              remaining: timeLeftRef.current,
              timeLeft: timeLeftRef.current
            });
            
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
        console.log(`Pausing timer for ${taskName} [${pauseId}], time left: ${timeLeftRef.current}`);
        
        isRunningRef.current = false;
        
        // If the payload contains timeLeft, use it
        if (payload.timeLeft !== undefined) {
          timeLeftRef.current = payload.timeLeft;
        }
        
        // Emit a tick event to ensure UI updates
        eventManager.emit('timer:tick', {
          taskName,
          remaining: timeLeftRef.current,
          timeLeft: timeLeftRef.current
        });
      }
    });
    
    // Handle timer resume - restart the interval with the current time left
    const unsubResume = eventManager.on('timer:resume', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Resuming timer for ${taskName} [${resumeId}], time left: ${timeLeftRef.current}`);
        
        isRunningRef.current = true;
        
        // If the payload contains timeLeft, use it
        if (payload.timeLeft !== undefined) {
          timeLeftRef.current = payload.timeLeft;
        }
        
        // Emit a tick event to ensure UI updates
        eventManager.emit('timer:tick', {
          taskName,
          remaining: timeLeftRef.current,
          timeLeft: timeLeftRef.current
        });
      }
    });
    
    // Handle timer tick - log tick events (no need to handle as we're emitting them)
    const unsubTick = eventManager.on('timer:tick', (payload) => {
      if (payload.taskName === taskName) {
        // Log but don't process as we're the emitter
        console.log(`Timer tick for ${taskName}: ${payload.remaining || payload.timeLeft}s remaining [${tickId}]`);
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      console.log(`Cleaning up timer event listeners for task: ${taskName}`, eventIdsRef.current);
      unsubInit();
      unsubExpand();
      unsubCollapse();
      unsubStart();
      unsubPause();
      unsubResume();
      unsubTick();
      
      // Clear any active timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [taskName, setInternalMinutes, setIsExpanded, expandedViewRef]);
};
