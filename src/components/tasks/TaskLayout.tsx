
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
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous observer if it exists
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    // Create new ResizeObserver with debounced callback
    let timeout: NodeJS.Timeout;
    resizeObserverRef.current = new ResizeObserver((entries) => {
      // Clear existing timeout
      if (timeout) {
        clearTimeout(timeout);
      }

      // Debounce the resize handling
      timeout = setTimeout(() => {
        if (!Array.isArray(entries) || !entries.length) return;
        
        const entry = entries[0];
        if (!entry.contentRect) return;

        // Handle resize if needed
        console.log('Container resized:', entry.contentRect);
      }, 100); // 100ms debounce
    });

    // Start observing
    resizeObserverRef.current.observe(containerRef.current);

    // Cleanup function
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
