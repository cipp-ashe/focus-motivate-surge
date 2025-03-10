
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

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
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  
  // Set up event handlers with the useEvent hook
  useEvent('task:create', onTaskCreate);
  useEvent('task:update', onTaskUpdate);
  useEvent('task:delete', onTaskDelete);
  
  // Handle force update events - with proper cleanup
  useEffect(() => {
    const handleForceUpdate = () => {
      if (isMountedRef.current) {
        onForceUpdate();
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [onForceUpdate]);
  
  // Process task queue with staggered timing to prevent race conditions
  // Make sure this doesn't run on every render and has proper cleanup
  useEffect(() => {
    // Avoid processing if already in progress or queue is empty
    if (processingRef.current || taskQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    
    const processQueue = async () => {      
      // Only process if component is still mounted
      if (!isMountedRef.current) return;
      
      // Use shorter delays on mobile to improve responsiveness
      const delay = isMobile ? 50 : 150;
      const finalDelay = isMobile ? 150 : 300;
      
      for (let i = 0; i < taskQueueRef.current.length; i++) {
        if (!isMountedRef.current) break;
        
        const task = taskQueueRef.current[i];
        
        // Emit creation event
        eventManager.emit('task:create', task);
        
        // Add a small delay between task creations
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Only continue if component is still mounted
      if (!isMountedRef.current) return;
      
      // Clear queue and release processing lock
      taskQueueRef.current = [];
      
      // Force a UI update after all tasks are processed
      let timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          window.dispatchEvent(new CustomEvent('force-task-update'));
          processingRef.current = false;
        }
      }, finalDelay);
      
      return () => clearTimeout(timeoutId);
    };
    
    // Start processing with a small delay
    const timeoutId = setTimeout(processQueue, isMobile ? 25 : 50);
    
    // Clean up timeout if component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Only run this once on mount
  
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
