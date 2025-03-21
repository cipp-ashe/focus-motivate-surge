
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

export const TaskContent: React.FC<TaskContentProps> = React.memo(({
  task,
  isSelected,
  isTimerView = false,
  dialogOpeners,
  handleTaskAction
}) => {
  // Handle checkbox changes with memoized callback
  const handleCheckboxChange = useCallback((checked: boolean) => {
    if (checked) {
      handleTaskAction({} as React.MouseEvent<HTMLElement>, 'complete');
    }
  }, [handleTaskAction]);

  return (
    <div className="flex items-start gap-2 w-full overflow-hidden" data-testid="task-content">
      <div className="flex-shrink-0">
        <TaskCheckbox 
          task={task} 
          isTimerView={isTimerView} 
          onCheck={handleCheckboxChange} 
        />
      </div>
      
      <div className="flex-grow min-w-0 overflow-hidden">
        <TaskContentDisplay task={task} handleTaskAction={handleTaskAction} />
      </div>
      
      <div className="flex-shrink-0">
        <TaskDetails
          task={task}
          isSelected={isSelected}
          dialogOpeners={dialogOpeners}
        />
      </div>
    </div>
  );
});

TaskContent.displayName = 'TaskContent';
