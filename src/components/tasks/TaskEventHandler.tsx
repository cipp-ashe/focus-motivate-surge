
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

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
  
  // Set up event handlers
  useEffect(() => {
    if (eventHandlersInitialized) return;
    
    eventHandlersInitialized = true;
    
    // Handle task create events
    const handleTaskCreate = (payload: any) => {
      if (!isMountedRef.current) return;
      onTaskCreate(payload);
    };
    
    // Handle task update events
    const handleTaskUpdate = (payload: { taskId: string; updates: Partial<Task> }) => {
      if (!isMountedRef.current) return;
      onTaskUpdate(payload);
    };
    
    // Handle task delete events
    const handleTaskDelete = (payload: { taskId: string }) => {
      if (!isMountedRef.current) return;
      onTaskDelete(payload);
    };
    
    // Handle task complete events
    const handleTaskComplete = (payload: { taskId: string; metrics?: any }) => {
      if (!isMountedRef.current) return;
      onTaskComplete(payload);
    };
    
    // Register the event listeners
    const unsubscribeCreate = eventManager.on('task:create', handleTaskCreate);
    const unsubscribeUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unsubscribeDelete = eventManager.on('task:delete', handleTaskDelete);
    const unsubscribeComplete = eventManager.on('task:complete', handleTaskComplete);
    
    const lastUpdateTimeRef = { current: 0 };
    
    // Handle timer task setting events
    const handleTimerTaskSet = (payload: any) => {
      console.log('TaskEventHandler: Received timer:set-task event', payload);
      
      // Force a reload to ensure UI consistency
      setTimeout(onForceUpdate, 100);
    };
    
    const unsubscribeTimerTask = eventManager.on('timer:set-task', handleTimerTaskSet);
    
    return () => {
      isMountedRef.current = false;
      
      // Unsubscribe from event manager events
      unsubscribeCreate();
      unsubscribeUpdate();
      unsubscribeDelete();
      unsubscribeComplete();
      unsubscribeTimerTask();
    };
  }, [onTaskCreate, onTaskUpdate, onTaskDelete, onTaskComplete, onForceUpdate]);
  
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
