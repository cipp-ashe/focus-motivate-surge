
import React from 'react';
import { Task } from '@/types/tasks';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TaskItem } from './components/TaskItem';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId: string | null;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  handleTaskSelect: (taskId: string) => void;
  handleDelete: (data: { taskId: string }) => void;
  handleTaskUpdate: (data: { taskId: string; updates: Partial<Task> }) => void;
  handleTaskComplete: (data: { taskId: string; metrics?: any }) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
  loadingCount?: number;
  onForceUpdate?: () => void;
  className?: string;
  taskCountInfo?: {
    total: number;
    completed: number;
  };
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  dialogOpeners,
  handleTaskSelect,
  handleDelete,
  handleTaskUpdate,
  handleTaskComplete,
  emptyState,
  isLoading = false,
  loadingCount = 3,
  onForceUpdate,
  className
}) => {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: loadingCount }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 border rounded-md">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <div className={className}>{emptyState}</div>;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          onSelect={() => handleTaskSelect(task.id)}
          onDelete={(e) => {
            e.stopPropagation();
            handleDelete({ taskId: task.id });
          }}
          onUpdate={(updates) => handleTaskUpdate({ taskId: task.id, updates })}
          onComplete={(metrics) => handleTaskComplete({ taskId: task.id, metrics })}
          dialogOpeners={dialogOpeners}
        />
      ))}
    </div>
  );
};
