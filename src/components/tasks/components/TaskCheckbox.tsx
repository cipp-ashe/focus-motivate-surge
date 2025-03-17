
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/tasks';

interface TaskCheckboxProps {
  task: Task;
  isTimerView?: boolean;
  onCheck: (checked: boolean) => void;
}

export const TaskCheckbox = React.memo(({ 
  task, 
  isTimerView = false,
  onCheck 
}: TaskCheckboxProps) => {
  // Skip checkbox for timer tasks in timer view
  if (isTimerView && task.taskType === 'timer') {
    return null;
  }
  
  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={(checked) => {
        onCheck(!!checked);
      }}
      aria-label={`Mark task "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
      onClick={(e) => e.stopPropagation()}
      className="mt-1"
    />
  );
});

TaskCheckbox.displayName = 'TaskCheckbox';
