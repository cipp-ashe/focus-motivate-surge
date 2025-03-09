
import { useEffect } from "react";
import { eventBus } from "@/lib/eventBus";
import { TimerExpandedViewRef } from "@/types/timer/views";

export const useTimerEventListeners = ({
  taskName,
  setInternalMinutes,
  setIsExpanded,
  expandedViewRef,
}: {
  taskName: string;
  setInternalMinutes: (minutes: number) => void;
  setIsExpanded: (expanded: boolean) => void;
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
}) => {
  // Listen for timer initialization events
  useEffect(() => {
    const unsubscribe = eventBus.on('timer:init', ({ taskName: eventTaskName, duration: newDuration }) => {
      if (eventTaskName === taskName) {
        console.log('Timer initialized with:', { taskName: eventTaskName, duration: newDuration });
        setInternalMinutes(Math.floor(newDuration / 60));
      }
    });

    return () => unsubscribe();
  }, [taskName, setInternalMinutes]);

  // Listen for expand/collapse events
  useEffect(() => {
    const unsubscribeExpand = eventBus.on('timer:expand', ({ taskName: eventTaskName }) => {
      if (eventTaskName === taskName) {
        console.log('Timer expanding view for:', eventTaskName);
        setIsExpanded(true);
      }
    });

    const unsubscribeCollapse = eventBus.on('timer:collapse', ({ taskName: eventTaskName, saveNotes }) => {
      if (eventTaskName === taskName) {
        console.log('Timer collapsing view for:', eventTaskName);
        if (saveNotes && expandedViewRef.current?.saveNotes) {
          expandedViewRef.current.saveNotes();
        }
        setIsExpanded(false);
      }
    });

    return () => {
      unsubscribeExpand();
      unsubscribeCollapse();
    };
  }, [taskName, setIsExpanded, expandedViewRef]);
};
