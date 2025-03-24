
import React from 'react';
import { Task } from '@/types/tasks';
import { X, MoreVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatusDropdown } from './TaskStatusDropdown';
import { eventManager } from '@/lib/events/EventManager';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TaskActionsProps {
  task: Task;
  isHovered: boolean;
  isSelected: boolean;
  handleDelete: () => void;
  handleTaskAction: (e: React.MouseEvent<Element, MouseEvent>, actionType?: string) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  task,
  isHovered,
  isSelected,
  handleDelete,
  handleTaskAction,
}) => {
  const { getIconColorClass } = useTaskTypeColor();
  const iconColorClass = getIconColorClass(task.taskType || 'regular');

  // Handle dismiss action (X button)
  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    console.log('Dismissing task:', task.id);

    // Emit the task:dismiss event directly
    eventManager.emit('task:dismiss', {
      taskId: task.id,
      habitId: task.relationships?.habitId,
      date: task.relationships?.date || new Date().toISOString(),
    });
  };

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2 z-dropdown">
      {/* Timer icon for timer tasks - on the left */}
      {task.taskType === 'timer' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            handleTaskAction(e as React.MouseEvent<Element, MouseEvent>, 'timer');
          }}
          aria-label="Select for timer"
        >
          <Clock className="h-4 w-4" />
        </Button>
      )}

      {/* On mobile, show a popover for more compact display */}
      <div className="hidden md:block">
        {/* Task status dropdown - in the middle for desktop */}
        <TaskStatusDropdown
          task={task}
          onStatusChange={(status) => {
            // Create a minimal event-like object that has the properties we need
            const mockEvent = {
              stopPropagation: () => {},
              preventDefault: () => {},
            } as React.MouseEvent<Element, MouseEvent>;

            handleTaskAction(mockEvent, `status-${status}`);
          }}
        />
      </div>

      {/* Mobile-optimized actions */}
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="text-sm font-medium mb-2 pb-1 border-b">Task Actions</div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 justify-start text-xs ${iconColorClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(e as React.MouseEvent<Element, MouseEvent>, 'status-completed');
                }}
              >
                Complete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-xs text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(e as React.MouseEvent<Element, MouseEvent>, 'status-in-progress');
                }}
              >
                In Progress
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-xs text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskAction(e as React.MouseEvent<Element, MouseEvent>, 'edit');
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-xs text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Dismiss button (X) - on the right */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-red-500"
        onClick={handleDismiss}
        aria-label="Dismiss task"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
