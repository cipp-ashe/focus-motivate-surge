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
  onTaskComplete: (data: { taskId: string, metrics?: any }) => void;
  onForceUpdate: () => void;
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  onForceUpdate
}) => {
  const isMountedRef = useRef(true);
  
  // Set up event handlers with the useEvent hook - these are optimized to prevent duplicates
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  useEvent('task:complete', onTaskComplete);
  
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
    
    // Event handler for timer task setting
    const timerTaskHandler = (event: CustomEvent) => {
      console.log('TaskEventHandler: Received timer:set-task event', event.detail);
      
      // Force a reload to ensure UI consistency
      setTimeout(onForceUpdate, 100);
    };
    
    window.addEventListener('timer:set-task', timerTaskHandler as EventListener);
    
    return () => {
      isMountedRef.current = false;
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('timer:set-task', timerTaskHandler as EventListener);
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
