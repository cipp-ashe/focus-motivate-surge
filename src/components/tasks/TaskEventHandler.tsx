
import React, { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';

interface TaskEventHandlerProps {
  onTaskCreate?: (task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (data: { taskId: string; reason?: string }) => void;
  onTaskComplete?: (data: { taskId: string; metrics?: any }) => void;
  onForceUpdate?: () => void;
  tasks: Task[];
}

/**
 * Component for handling task-related events 
 * Now using the consolidated useTaskEvents hook
 */
export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  onForceUpdate,
  tasks
}) => {
  // Use our consolidated task events hook
  const {
    onTaskCreate: subscribeToTaskCreate,
    onTaskUpdate: subscribeToTaskUpdate,
    onTaskDelete: subscribeToTaskDelete,
    onTaskComplete: subscribeToTaskComplete,
    onTaskReload: subscribeToTaskReload
  } = useTaskEvents();

  useEffect(() => {
    // Event handlers
    const handleTaskCreate = (task: Task) => {
      console.log('TaskEventHandler: Task create event received', task);
      if (onTaskCreate) {
        onTaskCreate(task);
      }
    };

    const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
      console.log('TaskEventHandler: Task update event received', data);
      if (onTaskUpdate) {
        onTaskUpdate(data);
      }
    };

    const handleTaskDelete = (data: { taskId: string; reason?: string }) => {
      console.log('TaskEventHandler: Task delete event received', data);
      if (onTaskDelete) {
        onTaskDelete(data);
      }
    };

    const handleTaskComplete = (data: { taskId: string; metrics?: any }) => {
      console.log('TaskEventHandler: Task complete event received', data);
      if (onTaskComplete) {
        onTaskComplete(data);
      }
    };

    const handleForceUpdate = () => {
      console.log('TaskEventHandler: Force update event received');
      if (onForceUpdate) {
        onForceUpdate();
      }
    };

    // Register event listeners
    const unsubCreate = subscribeToTaskCreate(handleTaskCreate);
    const unsubUpdate = subscribeToTaskUpdate(handleTaskUpdate);
    const unsubDelete = subscribeToTaskDelete(handleTaskDelete);
    const unsubComplete = subscribeToTaskComplete(handleTaskComplete);
    const unsubForceUpdate = subscribeToTaskReload(handleForceUpdate);

    // Clean up on unmount
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubComplete();
      unsubForceUpdate();
    };
  }, [
    subscribeToTaskCreate,
    subscribeToTaskUpdate,
    subscribeToTaskDelete,
    subscribeToTaskComplete,
    subscribeToTaskReload,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
    onTaskComplete,
    onForceUpdate
  ]);

  // This component doesn't render anything
  return null;
};
