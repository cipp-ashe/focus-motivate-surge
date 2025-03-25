import React from 'react';
import { Task } from '@/types/tasks';
import { TaskItem } from './components/TaskItem';
import { logger } from '@/utils/logManager';

export interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  handleTaskSelect?: (taskId: string) => void;
  handleTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  handleTaskComplete?: (data: { taskId: string; metrics?: any }) => void;
  handleDelete?: (data: { taskId: string }) => void;
  emptyState?: React.ReactNode;
  isTimerView?: boolean;
  isLoading?: boolean;
  onForceUpdate?: () => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTaskId,
  handleTaskSelect,
  handleTaskUpdate,
  handleTaskComplete,
  handleDelete,
  emptyState,
  isTimerView = false,
  dialogOpeners,
}) => {
  if (tasks.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-2 max-h-[80vh] overflow-y-auto pr-1 scrollbar-thin">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={selectedTaskId === task.id}
          isTimerView={isTimerView}
          onSelect={() => handleTaskSelect?.(task.id)}
          onDelete={handleDelete ? () => handleDelete({ taskId: task.id }) : undefined}
          onUpdate={
            handleTaskUpdate
              ? (updates) => handleTaskUpdate({ taskId: task.id, updates })
              : undefined
          }
          onComplete={
            handleTaskComplete
              ? (metrics) => handleTaskComplete({ taskId: task.id, metrics })
              : undefined
          }
          dialogOpeners={dialogOpeners}
        />
      ))}
    </div>
  );
};
