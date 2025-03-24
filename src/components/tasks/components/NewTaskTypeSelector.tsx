
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { TaskIcon, getTaskTypeLabel } from './TaskIcon';

interface NewTaskTypeSelectorProps {
  onSelect: (type: TaskType) => void;
}

export const NewTaskTypeSelector: React.FC<NewTaskTypeSelectorProps> = ({ onSelect }) => {
  // Define available task types for new task creation
  const taskTypes: TaskType[] = [
    'regular',
    'timer',
    'checklist',
    'journal',
    'screenshot',
    'voicenote',
    'counter' as TaskType,
    'rating' as TaskType
  ];
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {taskTypes.map((type) => (
        <Button
          key={type}
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 h-auto py-4"
          onClick={() => onSelect(type)}
        >
          <TaskIcon taskType={type} size={20} />
          <span className="text-xs">{getTaskTypeLabel(type)}</span>
        </Button>
      ))}
    </div>
  );
};
