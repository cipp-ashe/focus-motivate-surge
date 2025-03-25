
import React from 'react';
import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';
import { TaskIcon } from './TaskIcon';

interface TaskContentDisplayProps {
  task: Task;
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
  hideTimerTag?: boolean;
}

export const TaskContentDisplay: React.FC<TaskContentDisplayProps> = ({
  task,
  handleTaskAction,
  hideTimerTag = false
}) => {
  const { getIconColorClass } = useTaskTypeColor();
  const iconColorClass = getIconColorClass(task.taskType);
  
  // Format the created at date
  const formattedDate = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : 'just now';
  
  const handleActionClick = (e: React.MouseEvent<HTMLElement>, actionType: string) => {
    e.stopPropagation();
    handleTaskAction(e, actionType);
  };
  
  return (
    <div className="flex flex-col w-full">
      {/* Task name */}
      <div className="flex items-center gap-1.5">
        <h3 className={cn(
          "text-base font-medium leading-tight truncate flex-grow",
          task.completed ? "text-muted-foreground line-through" : "text-foreground/90 dark:text-foreground/90"
        )}>
          {task.name}
        </h3>
      </div>
      
      {/* Task metadata */}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {/* Task type icon and tag */}
        {task.taskType && !hideTimerTag && (
          <div 
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium",
              "bg-background/80 dark:bg-background/30 border border-border/30 dark:border-border/20",
              iconColorClass
            )}
          >
            <TaskIcon type={task.taskType} size={12} />
            <span className="capitalize">{task.taskType}</span>
          </div>
        )}
        
        {/* Created at date */}
        <span className="text-xs text-muted-foreground dark:text-muted-foreground/80">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
