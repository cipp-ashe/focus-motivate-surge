
import React from 'react';
import { Button } from '@/components/ui/button';
import { TaskType } from '@/types/tasks';
import { CheckSquare, Clock, Image, FileText, Mic, Focus, CheckCircle2, ClipboardList } from 'lucide-react';
import { TaskIcon } from './components/TaskIcon';

interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (type: TaskType) => void;
}

export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({ value, onChange }) => {
  const types: { type: TaskType; icon: React.ReactNode; label: string }[] = [
    { type: 'regular', icon: <CheckSquare className="h-4 w-4" />, label: 'Task' },
    { type: 'timer', icon: <Clock className="h-4 w-4" />, label: 'Timer' },
    { type: 'screenshot', icon: <Image className="h-4 w-4" />, label: 'Screenshot' },
    { type: 'journal', icon: <FileText className="h-4 w-4" />, label: 'Journal' },
    { type: 'voicenote', icon: <Mic className="h-4 w-4" />, label: 'Voice' },
    { type: 'focus', icon: <Focus className="h-4 w-4" />, label: 'Focus' },
    { type: 'habit', icon: <CheckCircle2 className="h-4 w-4" />, label: 'Habit' },
    { type: 'checklist', icon: <ClipboardList className="h-4 w-4" />, label: 'Checklist' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(({ type, icon, label }) => (
        <Button
          key={type}
          variant={value === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(type)}
          className="flex items-center gap-1"
        >
          {icon}
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};
