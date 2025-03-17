
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
  
  // Prepare accessible label
  const accessibleLabel = `Mark task "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`;
  
  // Handle checkbox change with memoized callback
  const handleCheckedChange = useCallback((checked: boolean | string) => {
    onCheck(!!checked);
  }, [onCheck]);
  
  // Handle click with memoized callback
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Stop event propagation to prevent triggering parent click handlers
    e.stopPropagation();
  }, []);
  
  return (
    <Checkbox
      checked={task.completed}
      onCheckedChange={handleCheckedChange}
      aria-label={accessibleLabel}
      onClick={handleClick}
      className="mt-1"
      data-testid="task-checkbox"
      id={`task-checkbox-${task.id}`}
      title={accessibleLabel}
      // Add proper aria attributes
      aria-checked={task.completed}
      role="checkbox"
    />
  );
});

TaskCheckbox.displayName = 'TaskCheckbox';
