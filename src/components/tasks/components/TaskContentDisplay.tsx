
import React from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TaskTypeIcon } from './TaskTypeIcon';

interface TaskContentDisplayProps {
  task: Task;
  handleTaskAction?: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContentDisplay = React.memo(({ task, handleTaskAction }: TaskContentDisplayProps) => {
  // Extract task data for easier access
  const { name, description, completed, taskType } = task;
  
  return (
    <div className="flex-1 min-w-0" data-testid="task-content-display">
      <div className="flex items-center gap-1.5">
        <TaskTypeIcon taskType={taskType || 'regular'} />
        
        <h3 
          className={cn(
            "font-medium break-words line-clamp-2",
            completed && "line-through text-muted-foreground"
          )}
          aria-label={`Task: ${name}`}
        >
          {name}
        </h3>
      </div>
      
      {description && (
        <p 
          className="text-xs text-muted-foreground mt-1 truncate"
          title={description}
        >
          {description}
        </p>
      )}
    </div>
  );
});

TaskContentDisplay.displayName = 'TaskContentDisplay';
