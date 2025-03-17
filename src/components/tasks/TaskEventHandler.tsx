
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

// Global flags to prevent duplicate event handling
let taskUiRefreshInitialized = false;
let forceTaskUpdateInitialized = false;
let taskSubmitCompleteInitialized = false;

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
  // Process task queue with staggered timing to prevent race conditions
  const processingRef = useRef(false);
  const taskQueueRef = useRef<Task[]>([]);
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  const lastUpdateTimeRef = useRef(0);
  const eventHandlersSetupRef = useRef(false);
  
  // Set up event handlers with the useEvent hook
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  
  // Handle our new custom UI refresh events - this is critical for immediate UI updates
  useEffect(() => {
    if (eventHandlersSetupRef.current || taskUiRefreshInitialized) return;
    
    const handleTaskUiRefresh = (event: CustomEvent) => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 500) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      console.log('TaskEventHandler: Received task-ui-refresh event');
      onForceUpdate();
    };
    
    window.addEventListener('task-ui-refresh', handleTaskUiRefresh as EventListener);
    taskUiRefreshInitialized = true;
    
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskUiRefresh as EventListener);
    };
  }, [onForceUpdate]);
  
  // Also handle legacy force update events for backward compatibility
  useEffect(() => {
    if (forceTaskUpdateInitialized) return;
    
    const handleForceUpdate = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 500) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      console.log('TaskEventHandler: Received force-task-update event');
      onForceUpdate();
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    forceTaskUpdateInitialized = true;
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [onForceUpdate]);
  
  // Set up cleanup for mounted ref
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Additional handler for task submission completion
  useEffect(() => {
    if (taskSubmitCompleteInitialized) return;
    
    const handleTaskSubmitComplete = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 500) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      console.log('TaskEventHandler: Task submission completed');
      onForceUpdate();
    };
    
    window.addEventListener('task-submit-complete', handleTaskSubmitComplete);
    taskSubmitCompleteInitialized = true;
    
    return () => {
      window.removeEventListener('task-submit-complete', handleTaskSubmitComplete);
    };
  }, [onForceUpdate]);
  
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
