
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';

interface TaskCheckboxProps {
  task: Task;
  isTimerView?: boolean;
  onCheck: (checked: boolean) => void;
}

export const TaskCheckbox: React.FC<TaskCheckboxProps> = ({
  task,
  isTimerView = false,
  onCheck
}) => {
  // Don't show checkbox in timer view for uncompleted tasks
  if (isTimerView && !task.completed) {
    return null;
  }

  return (
    <div 
      className="flex items-center justify-center h-5 w-5"
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onCheck(checked === true)}
        className={cn(
          "transition-colors",
          task.completed && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        )}
      />
    </div>
  );
};
