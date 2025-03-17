
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';

// Global flag to prevent duplicate event handling
let eventHandlersInitialized = false;

export interface TaskEventHandlerProps {
  tasks: Task[];
  onTaskCreate: (task: Task) => void;
  onTaskUpdate: (data: { taskId: string, updates: Partial<Task> }) => void;
  onTaskDelete: (data: { taskId: string }) => void;
  onForceUpdate: () => void;
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onForceUpdate
}) => {
  const isMountedRef = useRef(true);
  
  // Set up event handlers with the useEvent hook - these are optimized to prevent duplicates
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  
  // Handle UI refresh events - minimize the number of handlers and debounce actions
  useEffect(() => {
    if (eventHandlersInitialized) return;
    
    eventHandlersInitialized = true;
    const lastUpdateTimeRef = { current: 0 };
    
    // Single combined event handler with debouncing
    const handleForceUpdate = () => {
      if (!isMountedRef.current) return;
      
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < 1000) {
        return;
      }
      
      lastUpdateTimeRef.current = now;
      onForceUpdate();
    };
    
    // Register only the essential event listeners
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [onForceUpdate]);
  
  // Set up cleanup for mounted ref
  useEffect(() => {
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
