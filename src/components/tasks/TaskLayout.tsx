
import React, { useEffect, useRef } from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';

interface TaskLayoutProps {
  timer: React.ReactNode;
  taskList: React.ReactNode;
}

export const TaskLayout = ({ timer, taskList }: TaskLayoutProps) => {
  const { isOpen: isNotesOpen, close: closeNotes } = useNotesPanel();
  const { isOpen: isHabitsOpen, close: closeHabits } = useHabitsPanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (!containerRef.current) return;

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    let timeout: NodeJS.Timeout;
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        if (!Array.isArray(entries) || !entries.length) return;
        const entry = entries[0];
        if (!entry.contentRect) return;
        console.log('Container resized:', entry.contentRect);
      }, 100);
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="main-layout">
      <div className={cn(
        "grid grid-cols-1 gap-4 h-full",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-2"
      )}>
        <div className="h-full flex flex-col">
          {taskList}
          {timer}
        </div>
      </div>
    </div>
  );
};
