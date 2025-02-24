
import React, { useEffect, useRef } from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/TaskContext';
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
    <div ref={containerRef} className="main-layout h-full bg-background">
      <div className={cn(
        "grid grid-cols-1 gap-4 h-full p-4",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-2"
      )}>
        <div className="h-full flex flex-col space-y-4">
          {taskList}
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
