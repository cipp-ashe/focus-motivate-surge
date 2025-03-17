
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

// Global flags to prevent duplicate event handling
let eventHandlersInitialized = false;

export interface TaskEventHandlerProps {
  tasks: Task[];
  onTaskCreate: (task: Task) => void;
  onTaskUpdate: (data: { taskId: string, updates: Partial<Task> }) => void;
  onTaskDelete: (data: { taskId: string }) => void;
  onForceUpdate: () => void;
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onForceUpdate
}) => {
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  const lastUpdateTimeRef = useRef(0);
  
  // Set up event handlers with the useEvent hook
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  
  // Handle UI refresh events - this is critical for immediate UI updates
  useEffect(() => {
    if (eventHandlersInitialized) return;
    
    eventHandlersInitialized = true;
    
    const handleTaskUiRefresh = (event: CustomEvent) => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 500) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      onForceUpdate();
    };
    
    // Combined event handler for all force update events
    const handleForceUpdate = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 500) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      onForceUpdate();
    };
    
    // Register all event listeners
    window.addEventListener('task-ui-refresh', handleTaskUiRefresh as EventListener);
    window.addEventListener('force-task-update', handleForceUpdate);
    window.addEventListener('task-submit-complete', handleForceUpdate);
    
    return () => {
      // Clean up all event listeners
      window.removeEventListener('task-ui-refresh', handleTaskUiRefresh as EventListener);
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('task-submit-complete', handleForceUpdate);
    };
  }, [onForceUpdate]);
  
  // Set up cleanup for mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export const useTaskQueue = () => {
  const taskQueueRef = useRef<Task[]>([]);
  
  const addToQueue = (task: Task) => {
    taskQueueRef.current.push(task);
  };
  
  const addMultipleToQueue = (tasks: Task[]) => {
    taskQueueRef.current.push(...tasks);
  };
  
  return {
    addToQueue,
    addMultipleToQueue,
    taskQueue: taskQueueRef
  };
};
