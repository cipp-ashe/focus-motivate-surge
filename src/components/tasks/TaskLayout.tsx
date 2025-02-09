
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
  const resizingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      if (resizingRef.current || !containerRef.current) return;
      
      resizingRef.current = true;
      
      // Get the computed style once
      const computedStyle = window.getComputedStyle(containerRef.current);
      const currentHeight = parseFloat(computedStyle.height);
      
      // Only update if height needs adjusting and element exists
      if (currentHeight > 0 && containerRef.current) {
        containerRef.current.style.minHeight = '0';
      }
      
      // Reset resizing flag after a short delay
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resizingRef.current = false;
      }, 100);
    };
    
    const observer = new ResizeObserver((entries) => {
      // Use requestIdleCallback if available, otherwise use setTimeout
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => handleResize(), { timeout: 100 });
      } else {
        setTimeout(handleResize, 16); // Roughly one frame at 60fps
      }
    });
    
    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      resizingRef.current = false;
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

