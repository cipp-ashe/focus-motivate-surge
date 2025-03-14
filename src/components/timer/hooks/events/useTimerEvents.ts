
import { useEffect, RefObject } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { TimerExpandedViewRef } from '@/types/timer';
import { logger } from '@/utils/logManager';

interface UseTimerEventsProps {
  taskName: string;
  setIsExpanded: (expanded: boolean) => void;
  expandedViewRef: RefObject<TimerExpandedViewRef | null>;
}

/**
 * Hook for handling timer expand/collapse events
 */
export const useTimerEvents = ({
  taskName,
  setIsExpanded,
  expandedViewRef,
}: UseTimerEventsProps) => {
  useEffect(() => {
    // Only set up listeners if we have a task name
    if (!taskName) return;
    
    logger.debug('TimerEvents', `Setting up expansion event listeners for task: ${taskName}`);
    
    // Handle timer initialization
    const unsubInit = eventManager.on('timer:init', (payload) => {
      if (payload.taskName === taskName) {
        logger.debug('TimerEvents', `Timer init for ${taskName} with duration: ${payload.duration}`);
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
    
    // Clean up all listeners when the component unmounts or taskName changes
    return () => {
      logger.debug('TimerEvents', `Cleaning up timer expansion event listeners for task: ${taskName}`);
      unsubInit();
      unsubExpand();
      unsubCollapse();
    };
  }, [taskName, setIsExpanded, expandedViewRef]);
};
