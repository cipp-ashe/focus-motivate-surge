
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

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let timeout: NodeJS.Timeout | null = null;
    
    const observer = new ResizeObserver(() => {
      // Clear any pending timeout
      if (timeout) {
        clearTimeout(timeout);
      }
      
      // Set a new timeout to handle the resize after a delay
      timeout = setTimeout(() => {
        if (element) {
          element.style.display = 'none';
          requestAnimationFrame(() => {
            if (element) {
              element.style.display = '';
            }
          });
        }
      }, 100);
    });

    observer.observe(element);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6",
        !(isNotesOpen || isHabitsOpen) && "lg:grid-cols-2"
      )}
    >
      {/* Task List */}
      <div className="space-y-4 sm:space-y-6">
        {taskList}
      </div>

      {/* Timer Container */}
      <div className="space-y-4 sm:space-y-6">
        {timer}
      </div>
    </div>
  );
};
