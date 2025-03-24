import React from 'react';
import { Task } from '@/types/tasks';
import { X, MoreVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskStatusDropdown } from './TaskStatusDropdown';
import { eventManager } from '@/lib/events/EventManager';

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
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 z-dropdown">
      {/* Timer icon for timer tasks - on the left */}
      {task.taskType === 'timer' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground bg-primary/10"
          onClick={(e) => {
            e.stopPropagation();
            handleTaskAction(e as React.MouseEvent<Element, MouseEvent>, 'true');
          }}
          aria-label="Select for timer"
        >
          <Clock className="h-4 w-4" />
        </Button>
      )}

      {/* Task status dropdown - in the middle */}
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

      {/* Dismiss button (X) - on the right */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-purple-500"
        onClick={handleDismiss}
        aria-label="Dismiss task"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
