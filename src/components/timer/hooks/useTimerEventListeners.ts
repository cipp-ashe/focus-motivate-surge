
import { useEffect, RefObject, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
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

  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    console.log(`Setting up timer event listeners for task: ${taskName}`);
    
    // Generate unique IDs for each event listener for debugging
    const initId = `timer:init:${taskName}:${Date.now()}`;
    const expandId = `timer:expand:${taskName}:${Date.now()}`;
    const collapseId = `timer:collapse:${taskName}:${Date.now()}`;
    
    eventIdsRef.current = { initId, expandId, collapseId };
    
    // Handle timer initialization
    const unsubInit = eventBus.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Timer init for ${taskName} with duration: ${payload.duration} [${initId}]`);
        const minutes = Math.floor(payload.duration / 60);
        setInternalMinutes(minutes);
      }
    });
    
    // Handle timer expand
    const unsubExpand = eventBus.on('timer:expand', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Expanding timer for ${taskName} [${expandId}]`);
        setIsExpanded(true);
      }
    });
    
    // Handle timer collapse
    const unsubCollapse = eventBus.on('timer:collapse', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Collapsing timer for ${taskName} [${collapseId}]`);
        setIsExpanded(false);
        if (payload.saveNotes && expandedViewRef.current) {
          expandedViewRef.current.saveNotes();
        }
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      console.log(`Cleaning up timer event listeners for task: ${taskName}`, eventIdsRef.current);
      unsubInit();
      unsubExpand();
      unsubCollapse();
    };
  }, [taskName, setInternalMinutes, setIsExpanded, expandedViewRef]);
};
