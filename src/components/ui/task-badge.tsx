
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type TaskType = 'timer' | 'journal' | 'checklist' | 'screenshot' | 'voicenote' | 'focus' | 'regular';

interface TaskBadgeProps {
  type: TaskType;
  className?: string;
  children?: React.ReactNode;
}

export function TaskBadge({ type, className, children }: TaskBadgeProps) {
  const getTypeClasses = () => {
    switch (type) {
      case 'timer':
        return 'bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300';
      case 'journal':
        return 'bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-300';
      case 'checklist':
        return 'bg-sky-500/15 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300';
      case 'screenshot':
        return 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300';
      case 'voicenote':
        return 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300';
      case 'focus':
        return 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300';
      case 'regular':
      default:
        return 'bg-muted text-muted-foreground dark:bg-muted/20';
    }
  };

  return (
    <Badge variant="outline" className={cn(getTypeClasses(), 'font-normal border-0', className)}>
      {children || type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
