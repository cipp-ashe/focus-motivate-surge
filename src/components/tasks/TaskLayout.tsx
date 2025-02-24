
import React, { useEffect, useRef } from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';

interface TaskLayoutProps {
  timer: React.ReactNode;
  taskList: React.ReactNode;
}

export const TaskLayout = ({ timer, taskList }: TaskLayoutProps) => {
  const { isOpen: isNotesOpen, close: closeNotes } = useNotesPanel();
  const { isOpen: isHabitsOpen, close: closeHabits } = useHabitsPanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { completed: completedTasks } = useTaskContext();

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-hidden">
      <div className={cn(
        "grid h-screen grid-rows-[1fr,auto] gap-4 p-4",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-2 lg:grid-rows-1"
      )}>
        <div className="h-full flex flex-col">
          {taskList}
        </div>
        
        <div className="h-full flex flex-col space-y-4 min-h-0">
          {timer}
          <CompletedTasks 
            tasks={completedTasks}
            onTasksClear={() => completedTasks.forEach(task => 
              eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' })
            )}
          />
        </div>
      </div>
    </div>
  );
};
