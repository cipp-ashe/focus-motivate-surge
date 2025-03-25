
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskType } from '@/types/tasks';

interface TaskBadgeProps {
  type: TaskType;
  className?: string;
  children?: React.ReactNode;
}

export function TaskBadge({ type, className, children }: TaskBadgeProps) {
  const getTypeClasses = () => {
    switch (type) {
      case 'timer':
        return 'bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300';
      case 'journal':
        return 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300';
      case 'checklist':
        return 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'screenshot':
        return 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300';
      case 'voicenote':
        return 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300';
      case 'habit':
        return 'bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300';
      case 'regular':
      default:
        return 'bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300';
    }
  };

  return (
    <Badge variant="outline" className={cn(getTypeClasses(), 'font-normal border-0', className)}>
      {children || type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
