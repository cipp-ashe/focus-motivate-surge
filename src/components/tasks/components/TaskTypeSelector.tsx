
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TASK_TYPE_DEFINITIONS } from '@/utils/taskTypeConfig';

interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (type: TaskType) => void;
}

export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {TASK_TYPE_DEFINITIONS.map(({ type, icon, label, color }) => (
        <Button
          key={type}
          variant={value === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(type)}
          className={cn(
            "flex items-center gap-1",
            value === type ? color.button : ""
          )}
        >
          <span className={value !== type ? color.icon : ""}>{icon}</span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};
