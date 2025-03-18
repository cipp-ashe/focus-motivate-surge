
import React from 'react';
import { Task } from '@/types/tasks';
import { TaskItem } from './components/TaskItem';
import { eventBus } from '@/lib/eventBus';

interface TaskListProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  handleTaskSelect: (taskId: string) => void;
  handleDelete: (data: { taskId: string }) => void;
  handleTaskUpdate: (data: { taskId: string; updates: Partial<Task> }) => void;
  handleTaskComplete: (data: { taskId: string; metrics?: any }) => void;
  onForceUpdate?: () => void;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  taskCountInfo?: any;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  selectedTaskId,
  handleTaskSelect,
  handleDelete,
  handleTaskUpdate,
  handleTaskComplete,
  onForceUpdate,
  isLoading,
  loadingCount,
  emptyState,
  dialogOpeners,
  taskCountInfo
}) => {
  const deleteTaskHandler = (taskId: string) => {
    if (handleDelete) {
      handleDelete({ taskId });
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
            onSelect={() => handleTaskSelect(task.id)}
            onDelete={() => deleteTaskHandler(task.id)}
          />
        ))
      )}
    </div>
  );
};
