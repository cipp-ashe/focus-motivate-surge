import React, { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskContentDisplay } from './TaskContentDisplay';
import { TaskDetails } from './TaskDetails';

export interface TaskContentProps {
  task: Task;
  isSelected: boolean;
  isTimerView?: boolean;
  onSelect?: () => void;
  editingTaskId?: string | null;
  inputValue?: string;
  onDelete?: (e: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
  onDurationClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  preventPropagation?: (e: React.MouseEvent | React.TouchEvent) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContent: React.FC<TaskContentProps> = React.memo(
  ({ task, isSelected, isTimerView = false, dialogOpeners, handleTaskAction }) => {
    // Handle checkbox changes with memoized callback
    const handleCheckboxChange = useCallback(
      (checked: boolean) => {
        if (checked) {
          // Create a minimal event-like object that has the properties we need
          const mockEvent = {
            stopPropagation: () => {},
            preventDefault: () => {},
          } as React.MouseEvent<HTMLElement>;

          // Change status to completed when checkbox is clicked
          handleTaskAction(mockEvent, 'status-completed');
        }
      },
      [handleTaskAction]
    );

    return (
      <div className="flex items-start gap-2 w-full overflow-hidden" data-testid="task-content">
        {/* Checkbox column - fixed width */}
        <div className="w-5 flex-shrink-0">
          <TaskCheckbox task={task} isTimerView={isTimerView} onCheck={handleCheckboxChange} />
        </div>

        {/* Main content column - flexible width */}
        <div className="flex-grow min-w-0 overflow-hidden pr-2">
          <TaskContentDisplay task={task} handleTaskAction={handleTaskAction} />
        </div>

        {/* Details column - only shown when needed */}
        <div className="flex-shrink-0">
          <TaskDetails task={task} isSelected={isSelected} dialogOpeners={dialogOpeners} />
        </div>
      </div>
    );
  }
);

TaskContent.displayName = 'TaskContent';
