
import { useCallback } from 'react';
import { Task, TaskStatus } from '@/types/tasks';
import { toast } from 'sonner';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';

export const useTaskActionHandler = (task: Task, onOpenTaskDialog?: () => void) => {
  // Use our consolidated task events hook
  const { emitEvent } = useTaskEvents();

  // Handle task deletion
  const handleDelete = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.stopPropagation();
      console.log('Deleting task:', task.id);

      // Emit deletion event
      emitEvent('task:delete', { taskId: task.id });

      // Show toast notification
      toast.success(`Task "${task.name}" deleted`);
    },
    [emitEvent, task.id, task.name]
  );

  // Handle task action
  const handleTaskAction = useCallback(
    (e: React.MouseEvent<Element>, actionType?: string) => {
      // Only call stopPropagation if it exists (it might be a synthetic event or a mock)
      if (e && typeof e.stopPropagation === 'function') {
        e.stopPropagation();
      }

      console.log('Task action:', actionType, 'for task:', task.id);

      if (!actionType) return;

      // Handle different action types
      switch (actionType) {
        case 'complete':
          emitEvent('task:complete', { taskId: task.id });
          toast.success(`Task "${task.name}" completed`);
          break;

        case 'dismiss':
          emitEvent('task:dismiss', {
            taskId: task.id,
            habitId: task.relationships?.habitId,
            date: task.relationships?.date || new Date().toISOString(),
          });
          toast.info(`Task "${task.name}" dismissed`);
          break;

        case 'delete':
          emitEvent('task:delete', { taskId: task.id });
          toast.info(`Task "${task.name}" deleted`);
          break;

        case 'edit':
          if (onOpenTaskDialog) {
            onOpenTaskDialog();
          }
          break;

        case 'timer':
          emitEvent('timer:set-task', {
            id: task.id,
            name: task.name,
            duration: typeof task.duration === 'number' ? task.duration : 1500, // Default to 25 min if not set
            completed: task.completed || false,
            createdAt: task.createdAt || new Date().toISOString(),
            type: task.type || task.taskType,
          });
          toast.info(`Timer set for task: ${task.name}`);
          break;

        default:
          // For status changes
          if (actionType.startsWith('status-')) {
            const status = actionType.replace('status-', '') as TaskStatus;
            emitEvent('task:update', {
              taskId: task.id,
              updates: { status },
            });
            toast.info(`Task "${task.name}" status changed to ${status}`);
          }
          // For specific task types, pass to parent component
          else if (onOpenTaskDialog) {
            onOpenTaskDialog();
          }
          break;
      }
    },
    [emitEvent, task, onOpenTaskDialog]
  );

  return { handleDelete, handleTaskAction };
};
