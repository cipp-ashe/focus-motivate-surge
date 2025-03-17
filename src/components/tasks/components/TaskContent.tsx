
import React, { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskContentDisplay } from './TaskContentDisplay';
import { TaskDetails } from './TaskDetails';

interface TaskContentProps {
  task: Task;
  isSelected: boolean;
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContent: React.FC<TaskContentProps> = ({
  task,
  isSelected,
  isTimerView = false,
  dialogOpeners,
  handleTaskAction
}) => {
  // Handle checkbox changes
  const handleCheckboxChange = useCallback((checked: boolean) => {
    handleTaskAction({} as React.MouseEvent<HTMLElement>, checked ? 'true' : 'false');
  }, [handleTaskAction]);

  return (
    <div className="flex items-start gap-2">
      <TaskCheckbox 
        task={task} 
        isTimerView={isTimerView} 
        onCheck={handleCheckboxChange} 
      />
      
      <TaskContentDisplay task={task} handleTaskAction={handleTaskAction} />
      
      <TaskDetails
        task={task}
        isSelected={isSelected}
        dialogOpeners={dialogOpeners}
      />
    </div>
  );
};
