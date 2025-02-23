
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
        "content-grid",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-2 lg:gap-6"
      )}>
        <div className="section-container">
          {taskList}
        </div>

        <div className="section-container">
          {timer}
        </div>
      </div>

      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          (isNotesOpen || isHabitsOpen) ? "opacity-100 z-40" : "opacity-0 pointer-events-none z-0"
        )}
        onClick={() => {
          closeNotes();
          closeHabits();
        }}
      />
    </div>
  );
};
