
import React, { useLayoutEffect, useRef } from 'react';
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

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let rafId: number;
    
    const observer = new ResizeObserver((entries) => {
      // Cancel any pending rAF
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // Schedule a new update
      rafId = requestAnimationFrame(() => {
        entries.forEach(entry => {
          if (entry.target === element && element) {
            // Only force reflow if element dimensions actually changed
            if (entry.contentRect.width !== element.offsetWidth || 
                entry.contentRect.height !== element.offsetHeight) {
              element.style.display = 'none';
              // Force reflow
              void element.offsetHeight;
              element.style.display = '';
            }
          }
        });
      });
    });

    observer.observe(element);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
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

