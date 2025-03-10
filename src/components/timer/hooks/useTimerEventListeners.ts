
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
    let isSubscribed = true;

    const unsubscribe = eventBus.on('timer:init', ({ taskName: eventTaskName, duration: newDuration }) => {
      if (!isSubscribed) return;
      if (eventTaskName === taskName) {
        console.log('Timer initialized with:', { taskName: eventTaskName, duration: newDuration });
        setInternalMinutes(Math.floor(newDuration / 60));
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [taskName, setInternalMinutes]);

  // Listen for expand/collapse events
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribeExpand = eventBus.on('timer:expand', ({ taskName: eventTaskName }) => {
      if (!isSubscribed) return;
      if (eventTaskName === taskName) {
        setIsExpanded(true);
      }
    });

    const unsubscribeCollapse = eventBus.on('timer:collapse', ({ taskName: eventTaskName, saveNotes }) => {
      if (!isSubscribed) return;
      if (eventTaskName === taskName) {
        if (saveNotes && expandedViewRef.current?.saveNotes) {
          expandedViewRef.current.saveNotes();
        }
        setIsExpanded(false);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribeExpand();
      unsubscribeCollapse();
    };
  }, [taskName, setIsExpanded, expandedViewRef]);
};
