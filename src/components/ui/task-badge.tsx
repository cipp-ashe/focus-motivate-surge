
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TaskType } from '@/types/tasks';
import { getTaskColorClass, getTaskLabel } from '@/utils/taskTypeConfig';

interface TaskBadgeProps {
  type: TaskType;
  className?: string;
  children?: React.ReactNode;
}

export function TaskBadge({ type, className, children }: TaskBadgeProps) {
  // Get background and text color from centralized config
  const colorClass = `bg-${type}-500/15 ${getTaskColorClass(type, 'icon')}`;

  return (
    <Badge variant="outline" className={cn(colorClass, 'font-normal border-0', className)}>
      {children || getTaskLabel(type)}
    </Badge>
  );
}
