
import { useEffect, RefObject } from 'react';
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
  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    console.log(`Setting up timer event listeners for task: ${taskName}`);
    
    // Handle timer initialization
    const unsubInit = eventBus.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Timer init for ${taskName} with duration: ${payload.duration}`);
        const minutes = Math.floor(payload.duration / 60);
        setInternalMinutes(minutes);
      }
    });
    
    // Handle timer expand
    const unsubExpand = eventBus.on('timer:expand', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Expanding timer for ${taskName}`);
        setIsExpanded(true);
      }
    });
    
    // Handle timer collapse
    const unsubCollapse = eventBus.on('timer:collapse', (payload) => {
      if (payload.taskName === taskName) {
        console.log(`Collapsing timer for ${taskName}`);
        setIsExpanded(false);
        if (payload.saveNotes && expandedViewRef.current) {
          expandedViewRef.current.saveNotes();
        }
      }
    });
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      console.log(`Cleaning up timer event listeners for task: ${taskName}`);
      unsubInit();
      unsubExpand();
      unsubCollapse();
    };
  }, [taskName, setInternalMinutes, setIsExpanded, expandedViewRef]);
};
