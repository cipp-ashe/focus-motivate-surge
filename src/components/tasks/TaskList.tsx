
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskItem } from './components/TaskItem';
import { eventBus } from '@/lib/eventBus';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  onTaskAction?: (action: string, taskId: string) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (taskId: string) => void;
  onForceUpdate?: () => void;
  onTaskComplete?: (taskId: string, metrics?: any) => void;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
  taskCountInfo?: any;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedTaskId,
  dialogOpeners,
  onTaskAction,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  emptyState
}) => {
  const handleTaskSelect = (taskId: string) => {
    if (onTaskAction) {
      onTaskAction('select', taskId);
    } else {
      eventBus.emit('task:select', taskId);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  const handleTaskAction = (e: React.MouseEvent<HTMLElement>, action?: string, taskId?: string) => {
    if (taskId && action && onTaskAction) {
      onTaskAction(action, taskId);
    }
  };

  return (
    <div className="space-y-2">
      {tasks.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground border border-dashed rounded-lg">
          {emptyState || "No tasks found"}
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={task.id === selectedTaskId}
            dialogOpeners={dialogOpeners}
            onOpenTaskDialog={undefined}
          />
        ))
      )}
    </div>
  );
};
