
import React, { useEffect, useRef } from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { cn } from '@/lib/utils';

interface TaskLayoutProps {
  timer: React.ReactNode;
  taskList: React.ReactNode;
}

export const TaskLayout = ({ timer, taskList }: TaskLayoutProps) => {
  const { isOpen: isNotesOpen } = useNotesPanel();
  const { isOpen: isHabitsOpen } = useHabitsPanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let frameId: number;
    
    const observer = new ResizeObserver((entries) => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      
      // Debounce the resize handler
      resizeTimeoutRef.current = window.setTimeout(() => {
        frameId = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.minHeight = '0';
          }
        });
      }, 100); // 100ms debounce
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 min-h-0 w-full",
        !(isNotesOpen || isHabitsOpen) && "lg:grid-cols-2"
      )}
    >
      {/* Task List */}
      <div className="space-y-4 sm:space-y-6 min-h-0 overflow-y-auto">
        {taskList}
      </div>

      {/* Timer Container */}
      <div className="space-y-4 sm:space-y-6 min-h-0 overflow-y-auto">
        {timer}
      </div>
    </div>
  );
};
