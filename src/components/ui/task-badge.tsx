
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
        return 'bg-[hsl(var(--timer-color)/0.15)] text-timer';
      case 'journal':
        return 'bg-[hsl(var(--journal-color)/0.15)] text-journal';
      case 'checklist':
        return 'bg-[hsl(var(--checklist-color)/0.15)] text-checklist';
      case 'screenshot':
        return 'bg-[hsl(var(--screenshot-color)/0.15)] text-screenshot';
      case 'voicenote':
        return 'bg-[hsl(var(--voicenote-color)/0.15)] text-voicenote';
      case 'focus':
        return 'bg-[hsl(var(--focus-color)/0.15)] text-focus';
      case 'regular':
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge variant="outline" className={cn(getTypeClasses(), 'font-normal', className)}>
      {children || type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
