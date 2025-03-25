
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TASK_TYPE_DEFINITIONS } from '@/utils/taskTypeConfig';

interface NewTaskTypeSelectorProps {
  onSelect: (type: TaskType) => void;
}

export const NewTaskTypeSelector: React.FC<NewTaskTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {TASK_TYPE_DEFINITIONS.map(({ type, icon, label, color }) => (
        <Button
          key={type}
          variant="outline"
          className={cn(
            "flex flex-col items-center justify-center gap-2 h-auto py-4",
            color.icon
          )}
          onClick={() => onSelect(type)}
        >
          <span className={color.icon}>
            {icon}
          </span>
          <span className="text-xs">{label}</span>
        </Button>
      ))}
    </div>
  );
};
