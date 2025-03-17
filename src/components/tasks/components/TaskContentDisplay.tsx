
import React from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TaskTypeIcon } from './TaskTypeIcon';

interface TaskContentDisplayProps {
  task: Task;
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContentDisplay = React.memo(({ task, handleTaskAction }: TaskContentDisplayProps) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5">
        <TaskTypeIcon taskType={task.taskType} />
        
        <h3 
          className={cn(
            "font-medium break-words line-clamp-2",
            task.completed && "line-through text-muted-foreground"
          )}
          aria-label={`Task: ${task.name}`}
        >
          {task.name}
        </h3>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {task.description}
        </p>
      )}
    </div>
  );
});

TaskContentDisplay.displayName = 'TaskContentDisplay';
