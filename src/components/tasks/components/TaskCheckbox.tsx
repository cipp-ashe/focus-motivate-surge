
import React, { useCallback } from 'react';
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
  
  // Handle checkbox change with memoized callback
  const handleCheckedChange = useCallback((checked: boolean | string) => {
    onCheck(!!checked);
  }, [onCheck]);
  
  // Handle click with memoized callback
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  
  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={handleCheckedChange}
      aria-label={`Mark task "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
      onClick={handleClick}
      className="mt-1"
      data-testid="task-checkbox"
    />
  );
});

TaskCheckbox.displayName = 'TaskCheckbox';
