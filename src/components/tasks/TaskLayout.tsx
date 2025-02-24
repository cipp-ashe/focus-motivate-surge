
import React, { useRef } from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { cn } from '@/lib/utils';
import { useWindowSize } from '@/hooks/useWindowSize';
import { CompletedTasks } from './CompletedTasks';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { Timer as TimerIcon } from 'lucide-react';

interface TaskLayoutProps {
  timer: React.ReactNode;
  taskList: React.ReactNode;
}

export const TaskLayout = ({ timer, taskList }: TaskLayoutProps) => {
  const { isOpen: isNotesOpen, close: closeNotes } = useNotesPanel();
  const { isOpen: isHabitsOpen, close: closeHabits } = useHabitsPanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { completed: completedTasks, selected: selectedTaskId } = useTaskContext();

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <div className={cn(
        "container mx-auto px-4 py-6",
        "grid gap-6",
        !(isNotesOpen || isHabitsOpen) && width >= 1024 && "lg:grid-cols-[1fr,auto] lg:items-start"
      )}>
        <div className="h-full flex flex-col">
          {taskList}
        </div>
        
        <div className={cn(
          "space-y-6",
          "lg:w-[450px] transition-all duration-300",
          !selectedTaskId && "lg:w-[350px]"
        )}>
          <div className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
            !selectedTaskId && "p-4"
          )}>
            {!selectedTaskId ? (
              <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-2">
                <TimerIcon className="h-8 w-8 text-muted-foreground/50" />
                <p>Select a task to start the timer</p>
                <p className="text-sm">Your timer configuration and controls will appear here</p>
              </div>
            ) : (
              timer
            )}
          </div>
          
          {completedTasks.length > 0 && (
            <CompletedTasks 
              tasks={completedTasks}
              onTasksClear={() => completedTasks.forEach(task => 
                eventBus.emit('task:delete', { taskId: task.id, reason: 'completed' })
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
