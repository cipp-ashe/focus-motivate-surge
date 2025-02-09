
import React from 'react';
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

  return (
    <div 
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-6 w-full h-full",
        !(isNotesOpen || isHabitsOpen) && "lg:grid-cols-2"
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

