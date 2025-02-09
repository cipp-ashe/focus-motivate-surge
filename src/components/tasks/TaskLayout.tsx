
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
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const isResizingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (isResizingRef.current || !containerRef.current) return;
      
      isResizingRef.current = true;
      
      // Clear any pending timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Debounce the resize handling
      resizeTimeoutRef.current = setTimeout(() => {
        entries.forEach(entry => {
          if (containerRef.current && entry.target === containerRef.current) {
            const height = entry.contentRect.height;
            if (height > 0) {
              containerRef.current.style.minHeight = '0';
            }
          }
        });
        isResizingRef.current = false;
      }, 100);
    };
    
    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid layout thrashing
      requestAnimationFrame(() => handleResize(entries));
    });
    
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      isResizingRef.current = false;
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

