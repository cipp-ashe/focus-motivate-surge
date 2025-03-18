
import React from 'react';
import { TaskType } from '@/types/tasks';
import { 
  FileText, 
  Timer, 
  BookOpen,

  CheckSquare, 
  Image, 
  Mic,
  BrainCircuit,
  CalendarClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskTypeFiltersProps {
  activeFilter: 'all' | TaskType;
  onFilterChange: (filter: 'all' | TaskType) => void;
  counts: {
    all: number;
    timer: number;
    regular: number;
    focus: number;
    journal: number;
    checklist: number;
    screenshot: number;
    voicenote: number;
  };
  className?: string;
}

export const TaskTypeFilters: React.FC<TaskTypeFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
  className
}) => {
  const filters = [
    { 
      id: 'all', 
      label: 'All', 
      icon: CalendarClock, 
      count: counts.all,
      color: 'primary'
    },
    { 
      id: 'regular', 
      label: 'Regular', 
      icon: FileText, 
      count: counts.regular,
      color: 'sky'
    },
    { 
      id: 'timer', 
      label: 'Timer', 
      icon: Timer, 
      count: counts.timer,
      color: 'purple'
    },
    { 
      id: 'focus', 
      label: 'Focus', 
      icon: BrainCircuit, 
      count: counts.focus,
      color: 'indigo'
    },
    { 
      id: 'journal', 
      label: 'Journal', 
      icon: BookOpen, 
      count: counts.journal,
      color: 'amber'
    },
    { 
      id: 'checklist', 
      label: 'Checklist', 
      icon: CheckSquare, 
      count: counts.checklist,
      color: 'cyan'
    },
    { 
      id: 'screenshot', 
      label: 'Screenshot', 
      icon: Image, 
      count: counts.screenshot,
      color: 'blue'
    },
    { 
      id: 'voicenote', 
      label: 'Voice Note', 
      icon: Mic, 
      count: counts.voicenote,
      color: 'rose'
    }
  ];

  return (
    <div className={cn("flex flex-wrap gap-2 p-2", className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const colorClass = isActive ? `bg-${filter.color}-100 dark:bg-${filter.color}-900/30 text-${filter.color}-600 dark:text-${filter.color}-400 border-${filter.color}-300 dark:border-${filter.color}-700/50` : '';
        
        return (
          <Button
            key={filter.id}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1.5 h-8 px-2 rounded border",
              isActive ? colorClass : "border-border/30 bg-background/50"
            )}
            onClick={() => onFilterChange(filter.id as 'all' | TaskType)}
          >
            <filter.icon className={cn(
              "h-3.5 w-3.5",
              isActive ? `text-${filter.color}-500` : "text-muted-foreground"
            )} />
            <span className="text-xs font-medium">{filter.label}</span>
            <span className={cn(
              "text-xs rounded-full px-1.5 py-0.5 bg-background/80",
              isActive ? `text-${filter.color}-600` : "text-muted-foreground"
            )}>
              {filter.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
