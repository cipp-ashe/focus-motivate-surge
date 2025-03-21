
import React from 'react';
import { Timer, FileText, Image, Mic, CheckSquare, FileSpreadsheet } from 'lucide-react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';

interface TaskTypeIconProps {
  taskType?: TaskType;
  className?: string;
}

export const TaskTypeIcon: React.FC<TaskTypeIconProps> = ({ taskType, className }) => {
  // Use our standardized task color classes from task-items.css
  const getTaskColorClass = (type: TaskType) => {
    return `task-${type}`;
  };

  const colorClass = taskType ? getTaskColorClass(taskType) : 'text-muted-foreground';

  switch (taskType) {
    case 'timer':
      return <Timer className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
    case 'journal':
      return <FileText className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
    case 'screenshot':
      return <Image className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
    case 'voicenote':
      return <Mic className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
    case 'checklist':
      return <CheckSquare className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
    default:
      return <FileSpreadsheet className={cn("h-4 w-4", colorClass, className)} aria-hidden="true" />;
  }
};
