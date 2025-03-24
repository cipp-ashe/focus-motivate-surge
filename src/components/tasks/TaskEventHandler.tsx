
import React, { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

interface TaskEventHandlerProps {
  onTaskCreate?: (task: Task) => void;
  onTaskUpdate?: (data: { taskId: string; updates: Partial<Task> }) => void;
  onTaskDelete?: (data: { taskId: string; reason?: string }) => void;
  onTaskComplete?: (data: { taskId: string; metrics?: any }) => void;
  onForceUpdate?: () => void;
  tasks: Task[];
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  onForceUpdate,
  tasks
}) => {
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
    const unsubCreate = eventManager.on('task:create', handleTaskCreate);
    const unsubUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unsubDelete = eventManager.on('task:delete', handleTaskDelete);
    const unsubComplete = eventManager.on('task:complete', handleTaskComplete);
    const unsubForceUpdate = eventManager.on('task:force-update', handleForceUpdate);

    // Clean up on unmount
    return () => {
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      unsubComplete();
      unsubForceUpdate();
    };
  }, [onTaskCreate, onTaskUpdate, onTaskDelete, onTaskComplete, onForceUpdate]);

  // This component doesn't render anything
  return null;
};
