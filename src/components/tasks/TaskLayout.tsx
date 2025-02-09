
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
    let rafId: number | null = null;
    let queued = false;
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(() => {
          if (entry && element) {
            const newWidth = entry.contentRect.width;
            const newHeight = entry.contentRect.height;
            
            if (newWidth !== element.offsetWidth || newHeight !== element.offsetHeight) {
              element.style.display = 'none';
              void element.offsetHeight;
              element.style.display = '';
            }
          }
          queued = false;
          rafId = null;
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(element, { box: 'border-box' });

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
