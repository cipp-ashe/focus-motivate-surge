
import React from 'react';
import { TaskType } from '@/types/tasks';
import { CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TASK_TYPE_DEFINITIONS, getTaskColorClass } from '@/utils/taskTypeConfig';

interface TaskTypeFiltersProps {
  activeFilter: 'all' | TaskType;
  onFilterChange: (filter: 'all' | TaskType) => void;
  counts: {
    all: number;
    timer: number;
    regular: number;
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
  // Create filters array with "All" option first, followed by task types
  const filters = [
    { 
      id: 'all', 
      label: 'All', 
      icon: CalendarClock, 
      count: counts.all,
      color: 'primary'
    },
    ...TASK_TYPE_DEFINITIONS.map(({ type, icon, label, color }) => ({
      id: type,
      label,
      icon: () => icon, // Convert React node to function component
      count: counts[type as keyof typeof counts] || 0,
      colorName: type === 'regular' ? 'slate' : 
                 type === 'timer' ? 'purple' : 
                 type === 'journal' ? 'amber' : 
                 type === 'checklist' ? 'emerald' : 
                 type === 'screenshot' ? 'blue' : 
                 type === 'voicenote' ? 'rose' : 'slate'
    }))
  ];

  return (
    <div className={cn("flex flex-wrap gap-2 p-2", className)}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const colorClass = isActive && filter.id !== 'all' 
          ? `bg-${filter.colorName}-100 dark:bg-${filter.colorName}-900/30 text-${filter.colorName}-600 dark:text-${filter.colorName}-400 border-${filter.colorName}-300 dark:border-${filter.colorName}-700/50` 
          : (isActive && filter.id === 'all' 
              ? `bg-${filter.color}-100 dark:bg-${filter.color}-900/30 text-${filter.color}-600 dark:text-${filter.color}-400 border-${filter.color}-300 dark:border-${filter.color}-700/50`
              : '');
        
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
            {filter.id === 'all' ? (
              <filter.icon className={cn(
                "h-3.5 w-3.5",
                isActive ? `text-${filter.color}-500` : "text-muted-foreground"
              )} />
            ) : (
              <span className={cn(
                "h-3.5 w-3.5",
                isActive ? `text-${filter.colorName}-500` : "text-muted-foreground"
              )}>
                {React.createElement(filter.icon)}
              </span>
            )}
            <span className="text-xs font-medium">{filter.label}</span>
            <span className={cn(
              "text-xs rounded-full px-1.5 py-0.5 bg-background/80",
              isActive && filter.id !== 'all' ? `text-${filter.colorName}-600` : 
              isActive && filter.id === 'all' ? `text-${filter.color}-600` :
              "text-muted-foreground"
            )}>
              {filter.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
};
