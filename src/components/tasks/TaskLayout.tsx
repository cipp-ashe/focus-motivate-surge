
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
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    let rafId: number;
    
    const observer = new ResizeObserver((entries) => {
      if (isProcessingRef.current) return;
      
      // Use requestAnimationFrame to batch updates
      rafId = requestAnimationFrame(() => {
        isProcessingRef.current = true;
        
        entries.forEach(entry => {
          if (entry.target === element && document.contains(element)) {
            // Force a reflow only when dimensions actually change
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
              element.style.display = 'none';
              void element.offsetHeight;
              element.style.display = '';
            }
          }
        });
        
        // Reset the processing flag after a short delay
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 100);
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      isProcessingRef.current = false;
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
