
import React, { useEffect, useRef } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { eventManager } from '@/lib/events/EventManager';

interface TaskEventHandlerProps {
  onForceUpdate: () => void;
}

export const TaskEventHandler: React.FC<TaskEventHandlerProps> = ({
  onForceUpdate
}) => {
  const { addTask, updateTask, deleteTask, completeTask } = useTaskContext();
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  
  // Handle event-driven task operations
  useEffect(() => {
    const handleTaskCreate = (task: any) => {
      if (isMountedRef.current) {
        console.log('TaskEventHandler: Received task:create event:', task.id);
        addTask(task);
      }
    };
    
    const handleTaskUpdate = (data: { taskId: string, updates: any }) => {
      if (isMountedRef.current) {
        console.log('TaskEventHandler: Received task:update event:', data.taskId);
        updateTask(data.taskId, data.updates);
      }
    };
    
    const handleTaskDelete = (data: { taskId: string, reason?: string }) => {
      if (isMountedRef.current) {
        console.log('TaskEventHandler: Received task:delete event:', data.taskId);
        deleteTask(data.taskId, data.reason);
      }
    };
    
    const handleTaskComplete = (data: { taskId: string, metrics?: any }) => {
      if (isMountedRef.current) {
        console.log('TaskEventHandler: Received task:complete event:', data.taskId);
        completeTask(data.taskId, data.metrics);
      }
    };
    
    // Register event listeners
    eventManager.on('task:create', handleTaskCreate);
    eventManager.on('task:update', handleTaskUpdate);
    eventManager.on('task:delete', handleTaskDelete);
    eventManager.on('task:complete', handleTaskComplete);
    
    // Also handle UI refresh events
    const handleTaskUiRefresh = () => {
      if (isMountedRef.current) {
        console.log('TaskEventHandler: Received task-ui-refresh event');
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(onForceUpdate);
      }
    };
    
    window.addEventListener('task-ui-refresh', handleTaskUiRefresh);
    window.addEventListener('force-task-update', handleTaskUiRefresh);
    
    // Clean up all event listeners
    return () => {
      isMountedRef.current = false;
      eventManager.off('task:create', handleTaskCreate);
      eventManager.off('task:update', handleTaskUpdate);
      eventManager.off('task:delete', handleTaskDelete);
      eventManager.off('task:complete', handleTaskComplete);
      window.removeEventListener('task-ui-refresh', handleTaskUiRefresh);
      window.removeEventListener('force-task-update', handleTaskUiRefresh);
    };
  }, [addTask, updateTask, deleteTask, completeTask, onForceUpdate, isMobile]);
  
  // This component doesn't render anything
  return null;
};

// Simplified task queue hook with better typing
export const useTaskQueue = () => {
  const { addTask } = useTaskContext();
  const queueRef = useRef<Array<any>>([]);
  
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;
    
    // Process tasks one by one
    queueRef.current.forEach(task => {
      addTask(task);
    });
    
    // Clear the queue
    queueRef.current = [];
    
    // Trigger a UI refresh
    window.dispatchEvent(new CustomEvent('task-ui-refresh'));
  }, [addTask]);
  
  const addToQueue = useCallback((task: any) => {
    queueRef.current.push(task);
  }, []);
  
  return {
    addToQueue,
    processQueue,
    queueRef
  };
};
