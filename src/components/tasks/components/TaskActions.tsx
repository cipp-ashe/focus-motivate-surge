
import React from 'react';
import { Task } from '@/types/tasks';
import { X, MoreVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatusDropdown } from './TaskStatusDropdown';

interface TaskActionsProps {
  task: Task;
  isHovered: boolean;
  isSelected: boolean;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  task,
  isHovered,
  isSelected,
  handleDelete,
  handleTaskAction
}) => {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-1">
      {/* Timer icon for timer tasks */}
      {task.taskType === 'timer' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            handleTaskAction(e, 'true');
          }}
          aria-label="Select for timer"
        >
          <Clock className="h-4 w-4" />
        </Button>
      )}
      
      {/* Task status dropdown */}
      {(isHovered || isSelected) && (
        <TaskStatusDropdown 
          task={task} 
          onStatusChange={(status) => handleTaskAction({} as any, `status-${status}`)} 
        />
      )}
      
      {/* Delete button */}
      {(isHovered || isSelected) && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
