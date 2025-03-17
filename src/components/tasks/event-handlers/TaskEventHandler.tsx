
import React, { useEffect, useRef, useCallback } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { eventManager } from '@/lib/events/EventManager';
import { debounce, throttle } from 'lodash';

interface TaskEventHandlerProps {
  onForceUpdate: () => void;
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onForceUpdate
}) => {
  const { addTask, updateTask, deleteTask, completeTask } = useTaskContext();
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  
  // Create memoized and throttled handlers to improve performance
  const throttledForceUpdate = useRef(
    throttle(() => {
      if (isMountedRef.current) {
        requestAnimationFrame(onForceUpdate);
      }
    }, 150)
  ).current;
  
  // Memoized event handlers to prevent recreating them on re-renders
  const handleTaskCreate = useCallback((task: any) => {
    if (isMountedRef.current) {
      console.log('TaskEventHandler: Received task:create event:', task.id);
      addTask(task);
      throttledForceUpdate();
    }
  }, [addTask, throttledForceUpdate]);
  
  const handleTaskUpdate = useCallback((data: { taskId: string, updates: any }) => {
    if (isMountedRef.current) {
      console.log('TaskEventHandler: Received task:update event:', data.taskId);
      updateTask(data.taskId, data.updates);
      throttledForceUpdate();
    }
  }, [updateTask, throttledForceUpdate]);
  
  const handleTaskDelete = useCallback((data: { taskId: string, reason?: string }) => {
    if (isMountedRef.current) {
      console.log('TaskEventHandler: Received task:delete event:', data.taskId);
      deleteTask(data.taskId, data.reason);
      throttledForceUpdate();
    }
  }, [deleteTask, throttledForceUpdate]);
  
  const handleTaskComplete = useCallback((data: { taskId: string, metrics?: any }) => {
    if (isMountedRef.current) {
      console.log('TaskEventHandler: Received task:complete event:', data.taskId);
      completeTask(data.taskId, data.metrics);
      throttledForceUpdate();
    }
  }, [completeTask, throttledForceUpdate]);
  
  // Handle UI refresh events
  const handleTaskUiRefresh = useCallback(() => {
    if (isMountedRef.current) {
      console.log('TaskEventHandler: Received task-ui-refresh event');
      throttledForceUpdate();
    }
  }, [throttledForceUpdate]);
  
  // Register and cleanup event listeners
  useEffect(() => {
    // Register event listeners
    eventManager.on('task:create', handleTaskCreate);
    eventManager.on('task:update', handleTaskUpdate);
    eventManager.on('task:delete', handleTaskDelete);
    eventManager.on('task:complete', handleTaskComplete);
    
    // UI refresh events
    window.addEventListener('task-ui-refresh', handleTaskUiRefresh);
    window.addEventListener('force-task-update', handleTaskUiRefresh);
    
    // Set up cleanup on unmount
    return () => {
      isMountedRef.current = false;
      
      // Remove all event listeners
      eventManager.off('task:create', handleTaskCreate);
      eventManager.off('task:update', handleTaskUpdate);
      eventManager.off('task:delete', handleTaskDelete);
      eventManager.off('task:complete', handleTaskComplete);
      window.removeEventListener('task-ui-refresh', handleTaskUiRefresh);
      window.removeEventListener('force-task-update', handleTaskUiRefresh);
      
      // Cancel any pending throttled operations
      throttledForceUpdate.cancel();
    };
  }, [
    handleTaskCreate, 
    handleTaskUpdate, 
    handleTaskDelete, 
    handleTaskComplete, 
    handleTaskUiRefresh, 
    throttledForceUpdate
  ]);
  
  // This component doesn't render anything
  return null;
};

// Improved task queue hook with proper typing and throttling
export const useTaskQueue = () => {
  const { addTask } = useTaskContext();
  const queueRef = useRef<Array<any>>([]);
  const isProcessingRef = useRef(false);
  
  const throttledProcessQueue = useRef(
    throttle(() => {
      if (queueRef.current.length === 0 || isProcessingRef.current) return;
      
      isProcessingRef.current = true;
      
      // Process tasks one by one
      queueRef.current.forEach(task => {
        addTask(task);
      });
      
      // Clear the queue
      queueRef.current = [];
      
      // Reset processing flag
      isProcessingRef.current = false;
      
      // Trigger a UI refresh
      window.dispatchEvent(new CustomEvent('task-ui-refresh'));
    }, 150)
  ).current;
  
  const addToQueue = useCallback((task: any) => {
    queueRef.current.push(task);
    throttledProcessQueue();
  }, [throttledProcessQueue]);
  
  const processQueue = useCallback(() => {
    throttledProcessQueue();
  }, [throttledProcessQueue]);
  
  // Also provide a cleanup method
  const cleanup = useCallback(() => {
    throttledProcessQueue.cancel();
  }, [throttledProcessQueue]);
  
  return {
    addToQueue,
    processQueue,
    queueRef,
    cleanup
  };
};
