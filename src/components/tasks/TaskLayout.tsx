
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
  const { isOpen: isNotesOpen } = useNotesPanel();
  const { isOpen: isHabitsOpen } = useHabitsPanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  // Add resize handler cleanup
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to debounce resize observations
      requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) return;
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 w-full h-full transition-all duration-300 ease-in-out",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-2"
      )}
    >
      {/* Task List */}
      <div className="flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
          {taskList}
        </div>
      </div>

      {/* Timer Container */}
      <div className="flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
          {timer}
        </div>
      </div>
    </div>
  );
};
