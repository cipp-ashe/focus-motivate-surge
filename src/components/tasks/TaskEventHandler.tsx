
import React from 'react';
import { Task } from '@/types/tasks';
import { useEvent } from '@/hooks/useEvent';

interface TaskEventHandlerProps {
  onTaskCreate?: (task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (data: { taskId: string; reason?: string }) => void;
  onTaskComplete?: (data: { taskId: string; metrics?: any }) => void;
  onForceUpdate?: () => void;
}

/**
 * Component for handling task-related events
 * Uses the unified event system
 */
export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  onForceUpdate,
}) => {
  // Use event hook for each event type
  useEvent('task:create', (task: Task) => {
    console.log('TaskEventHandler: Task create event received', task);
    if (onTaskCreate) {
      onTaskCreate(task);
    }
  });

  useEvent('task:update', (data: { taskId: string; updates: Partial<Task> }) => {
    console.log('TaskEventHandler: Task update event received', data);
    if (onTaskUpdate) {
      onTaskUpdate(data);
    }
  });

  useEvent('task:delete', (data: { taskId: string; reason?: string }) => {
    console.log('TaskEventHandler: Task delete event received', data);
    if (onTaskDelete) {
      onTaskDelete(data);
    }
  });

  useEvent('task:complete', (data: { taskId: string; metrics?: any }) => {
    console.log('TaskEventHandler: Task complete event received', data);
    if (onTaskComplete) {
      onTaskComplete(data);
    }
  });

  useEvent('task:reload', () => {
    console.log('TaskEventHandler: Force update event received');
    if (onForceUpdate) {
      onForceUpdate();
    }
  });

  // This component doesn't render anything
  return null;
};
