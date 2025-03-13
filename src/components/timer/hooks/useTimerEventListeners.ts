
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

  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    console.log(`Setting up timer event listeners for task: ${taskName}`);
    
    // Generate unique IDs for each event listener for debugging
    const initId = `timer:init:${taskName}:${Date.now()}`;
    const expandId = `timer:expand:${taskName}:${Date.now()}`;
    const collapseId = `timer:collapse:${taskName}:${Date.now()}`;
    const startId = `timer:start:${taskName}:${Date.now()}`;
    const tickId = `timer:tick:${taskName}:${Date.now()}`;
    
    eventIdsRef.current = { initId, expandId, collapseId, startId, tickId };
    
    // Handle timer initialization
    const unsubInit = eventManager.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Timer init for ${taskName} with duration: ${payload.duration} [${initId}]`);
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
        
        let currentTimeLeft = payload.duration;
        
        // Create new interval for countdown
        timerIntervalRef.current = setInterval(() => {
          currentTimeLeft -= 1;
          
          // Emit tick event with the new time
          eventManager.emit('timer:tick', {
            taskName,
            remaining: currentTimeLeft,
            timeLeft: currentTimeLeft
          });
          
          // Check if timer is complete
          if (currentTimeLeft <= 0) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            eventManager.emit('timer:complete', { taskName });
          }
        }, 1000);
      }
    });
    
    // Handle timer tick - log tick events
    const unsubTick = eventManager.on('timer:tick', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Timer tick for ${taskName}: ${payload.remaining}s remaining [${tickId}]`);
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      console.log(`Cleaning up timer event listeners for task: ${taskName}`, eventIdsRef.current);
      unsubInit();
      unsubExpand();
      unsubCollapse();
      unsubStart();
      unsubTick();
      
      // Clear any active timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [taskName, setInternalMinutes, setIsExpanded, expandedViewRef]);
};
