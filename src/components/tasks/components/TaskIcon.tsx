
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Timer, FileText, BookOpen, CheckSquare, Image, Mic, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskIconProps {
  taskType?: TaskType;
  className?: string;
  size?: number;
  muted?: boolean;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ 
  taskType = 'regular',
  className,
  size = 16,
  muted = false
}) => {
  // Use the color tokens defined in tailwind.config.ts
  const colorClass = muted 
    ? 'text-muted-foreground' 
    : `text-${taskType}`;
  
  // Determine which icon to render based on task type
  switch (taskType) {
    case 'timer':
      return <Timer className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'journal':
      return <BookOpen className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'checklist':
      return <CheckSquare className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'screenshot':
      return <Image className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'voicenote':
      return <Mic className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'focus':
      return <FileSpreadsheet className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'regular':
    default:
      return <FileText className={cn(colorClass, className)} size={size} aria-hidden="true" />;
  }
};

export default TaskIcon;
