
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';

interface TaskEventHandlerProps {
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
  // Process task queue with staggered timing to prevent race conditions
  const processingRef = useRef(false);
  const taskQueueRef = useRef<Task[]>([]);
  
  // Set up event handlers with the useEvent hook
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  
  // Handle force update events - with proper cleanup
  useEffect(() => {
    const handleForceUpdate = () => {
      onForceUpdate();
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [onForceUpdate]);
  
  // Process task queue with staggered timing to prevent race conditions
  // Make sure this doesn't run on every render
  useEffect(() => {
    if (processingRef.current || taskQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    
    const processQueue = async () => {      
      for (let i = 0; i < taskQueueRef.current.length; i++) {
        const task = taskQueueRef.current[i];
        
        // Emit creation event
        eventManager.emit('task:create', task);
        
        // Add a small delay between task creations
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Clear queue and release processing lock
      taskQueueRef.current = [];
      
      // Force a UI update after all tasks are processed
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-task-update'));
        processingRef.current = false;
      }, 300);
    };
    
    // Start processing with a small delay
    const timeoutId = setTimeout(processQueue, 50);
    
    // Clean up timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Only run this once on mount
  
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
