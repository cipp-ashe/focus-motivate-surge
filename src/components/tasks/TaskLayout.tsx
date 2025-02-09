
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
  const frameRef = useRef<number>();
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    
    const observer = new ResizeObserver(() => {
      console.log('Resize detected');
      
      // Clear any existing animation frame
      if (frameRef.current) {
        console.log('Canceling previous animation frame');
        cancelAnimationFrame(frameRef.current);
      }
      
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        console.log('Clearing previous timeout');
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Set a new timeout
      resizeTimeoutRef.current = setTimeout(() => {
        console.log('Timeout triggered, requesting animation frame');
        frameRef.current = requestAnimationFrame(() => {
          if (element && document.contains(element)) {
            console.log('Applying reflow fix');
            element.style.display = 'none';
            // Force reflow
            void element.offsetHeight;
            element.style.display = '';
          }
        });
      }, 200); // Increased debounce time further
    });

    console.log('Setting up ResizeObserver');
    observer.observe(element);

    return () => {
      console.log('Cleaning up ResizeObserver');
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
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

