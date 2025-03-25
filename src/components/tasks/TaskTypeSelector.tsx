
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskType } from '@/types/tasks';
import { CheckSquare, Clock, Image, FileText, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (type: TaskType) => void;
}

export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({ value, onChange }) => {
  const { getIconColorClass, getButtonColorClass } = useTaskTypeColor();
  
  const types: { type: TaskType; icon: React.ReactNode; label: string }[] = [
    { type: 'regular', icon: <CheckSquare className="h-4 w-4" />, label: 'Task' },
    { type: 'timer', icon: <Clock className="h-4 w-4" />, label: 'Timer' },
    { type: 'screenshot', icon: <Image className="h-4 w-4" />, label: 'Screenshot' },
    { type: 'journal', icon: <FileText className="h-4 w-4" />, label: 'Journal' },
    { type: 'voicenote', icon: <Mic className="h-4 w-4" />, label: 'Voice' },
    { type: 'checklist', icon: <CheckSquare className="h-4 w-4" />, label: 'Checklist' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(({ type, icon, label }) => {
        const iconColorClass = getIconColorClass(type);
        
        return (
          <Button
            key={type}
            variant={value === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(type)}
            className={cn(
              "flex items-center gap-1",
              value === type ? getButtonColorClass(type) : ""
            )}
          >
            <span className={value !== type ? iconColorClass : ""}>{icon}</span>
            <span>{label}</span>
          </Button>
        );
      })}
    </div>
  );
};
