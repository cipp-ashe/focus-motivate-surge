
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
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    
    const observer = new ResizeObserver(() => {
      // Cancel any pending rAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Schedule new update
      rafRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.minHeight = '0';
        }
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
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

