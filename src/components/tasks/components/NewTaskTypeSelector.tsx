
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { TaskIcon, getTaskTypeLabel } from './TaskIcon';
import { CheckSquare, Clock, Image, FileText, Mic } from 'lucide-react';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';
import { cn } from '@/lib/utils';

interface NewTaskTypeSelectorProps {
  onSelect: (type: TaskType) => void;
}

export const NewTaskTypeSelector: React.FC<NewTaskTypeSelectorProps> = ({ onSelect }) => {
  const { getIconColorClass } = useTaskTypeColor();
  
  // Define available task types for new task creation
  const taskTypes: TaskType[] = [
    'regular',
    'timer',
    'checklist',
    'journal',
    'screenshot',
    'voicenote'
  ];
  
  // Map of task types to their corresponding icons
  const taskTypeIcons = {
    regular: <CheckSquare className="h-5 w-5" />,
    timer: <Clock className="h-5 w-5" />,
    journal: <FileText className="h-5 w-5" />,
    checklist: <CheckSquare className="h-5 w-5" />,
    screenshot: <Image className="h-5 w-5" />,
    voicenote: <Mic className="h-5 w-5" />,
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {taskTypes.map((type) => {
        const iconColorClass = getIconColorClass(type);
        
        return (
          <Button
            key={type}
            variant="outline"
            className={cn(
              "flex flex-col items-center justify-center gap-2 h-auto py-4",
              iconColorClass
            )}
            onClick={() => onSelect(type)}
          >
            <span className={iconColorClass}>
              {taskTypeIcons[type] || <CheckSquare className="h-5 w-5" />}
            </span>
            <span className="text-xs">{getTaskTypeLabel(type)}</span>
          </Button>
        );
      })}
    </div>
  );
};
