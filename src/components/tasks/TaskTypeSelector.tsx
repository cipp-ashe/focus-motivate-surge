
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

  // Ensure consistent coloring based on the same task type color system
  const getButtonClasses = (type: TaskType) => {
    if (value !== type) return ""; // Default outline style

    switch (type) {
      case 'timer':
        return "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700";
      case 'journal':
        return "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700";
      case 'checklist':
        return "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700";
      case 'screenshot':
        return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";
      case 'voicenote':
        return "bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700";
      case 'focus':
        return "bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700";
      case 'habit':
        return "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700";
      default:
        return "bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700";
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(({ type, icon, label }) => (
        <Button
          key={type}
          variant={value === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(type)}
          className={`flex items-center gap-1 ${getButtonClasses(type)}`}
        >
          {icon}
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
};
