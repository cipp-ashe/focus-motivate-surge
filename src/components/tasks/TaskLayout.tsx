
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
  const rafIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      // Clear any existing timeout and RAF
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // Debounce and batch resize operations
      resizeTimeoutRef.current = window.setTimeout(() => {
        rafIdRef.current = requestAnimationFrame(() => {
          if (!containerRef.current) return;
          
          // Get the computed style
          const computedStyle = window.getComputedStyle(containerRef.current);
          const currentHeight = parseFloat(computedStyle.height);
          
          // Only update if height needs adjusting
          if (currentHeight > 0) {
            containerRef.current.style.minHeight = '0';
          }
        });
      }, 150); // Increased debounce time for better performance
    };
    
    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
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

