
import React from 'react';
import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

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
  const { getIconColorClass, getBackgroundColorClass } = useTaskTypeColor();
  
  // Format the relative time
  const timeAgo = task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : '';
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <div className="font-medium break-words">{task.name}</div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className="text-xs flex items-center capitalize" 
            onClick={(e) => handleTaskAction(e, 'status')}
          >
            {task.status || 'pending'}
          </Badge>
          
          {/* Timer Badge - Only show if not hidden */}
          {task.taskType === 'timer' && !hideTimerTag && (
            <Badge 
              className={cn(
                "text-xs flex items-center", 
                getBackgroundColorClass(task.taskType)
              )}
            >
              timer
            </Badge>
          )}
          
          {/* Duration Badge */}
          {task.duration && (
            <Badge 
              onClick={(e) => handleTaskAction(e, 'duration')}
              variant="outline" 
              className="text-xs flex items-center cursor-pointer"
            >
              {Math.floor(task.duration / 60)} min
            </Badge>
          )}
        </div>
      </div>
      
      {/* Timestamp */}
      <div className="text-xs text-muted-foreground mt-1">{timeAgo}</div>
    </div>
  );
};
