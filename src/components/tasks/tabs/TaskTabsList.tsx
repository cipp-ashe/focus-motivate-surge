import React from 'react';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskIcon } from '../components/TaskIcon';
import { TASK_TYPE_DEFINITIONS } from '@/utils/taskTypeConfig';

interface TaskTabsListProps {
  activeTaskType: string;
  onTaskTypeChange: (type: string) => void;
  taskCounts: Record<string, number>;
}

export const TaskTabsList: React.FC<TaskTabsListProps> = ({
  activeTaskType,
  onTaskTypeChange,
  taskCounts,
}) => {
  // Define the task type tabs, starting with the "All Tasks" option
  const taskTypes = [
    { id: 'all', name: 'All Tasks', icon: <Layers className="h-4 w-4 mr-1.5" /> },
    ...TASK_TYPE_DEFINITIONS.map(({ type, label }) => ({
      id: type,
      name: label + 's', // Pluralize the task type name for the tab
      icon: <TaskIcon type={type} size={16} className="mr-1.5" />,
    })),
  ];

  return (
    <ScrollArea className="pb-1">
      <div className="flex items-center gap-1 px-4 pt-3 pb-2 overflow-x-auto hide-scrollbar">
        {taskTypes.map((type) => (
          <Button
            key={type.id}
            variant={activeTaskType === type.id ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              'h-8 rounded-md text-xs font-normal justify-start',
              activeTaskType === type.id
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onTaskTypeChange(type.id)}
          >
            {type.icon}
            {type.name}
            {taskCounts[type.id] > 0 && (
              <span
                className={cn(
                  'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]',
                  activeTaskType === type.id
                    ? 'bg-primary/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {taskCounts[type.id]}
              </span>
            )}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
