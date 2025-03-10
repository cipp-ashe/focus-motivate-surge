
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';

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
  
  // Listen for task-related events
  useEffect(() => {
    console.log("TaskEventHandler - Setting up event listeners");
    
    const handleTaskCreate = (task: Task) => {
      console.log("TaskEventHandler - Task created event received:", task);
      onTaskCreate(task);
    };
    
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      console.log("TaskEventHandler - Task update event received:", data);
      onTaskUpdate(data);
    };
    
    const handleTaskDelete = (data: { taskId: string }) => {
      console.log("TaskEventHandler - Task delete event received:", data);
      onTaskDelete(data);
    };
    
    const handleForceUpdate = () => {
      console.log("TaskEventHandler - Force update event received");
      onForceUpdate();
    };
    
    // Subscribe to events
    const unsubCreate = eventBus.on('task:create', handleTaskCreate);
    const unsubUpdate = eventBus.on('task:update', handleTaskUpdate);
    const unsubDelete = eventBus.on('task:delete', handleTaskDelete);
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      // Unsubscribe from events
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [onTaskCreate, onTaskUpdate, onTaskDelete, onForceUpdate]);
  
  // Process task queue with staggered timing to prevent race conditions
  useEffect(() => {
    if (processingRef.current || taskQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    
    const processQueue = async () => {
      console.log(`TaskEventHandler - Processing queue with ${taskQueueRef.current.length} tasks`);
      
      for (let i = 0; i < taskQueueRef.current.length; i++) {
        const task = taskQueueRef.current[i];
        
        // Emit creation event
        console.log(`TaskEventHandler - Creating task ${i + 1}/${taskQueueRef.current.length}:`, task);
        eventBus.emit('task:create', task);
        
        // Add a small delay between task creations
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Clear queue and release processing lock
      taskQueueRef.current = [];
      
      // Force a UI update after all tasks are processed
      setTimeout(() => {
        console.log("TaskEventHandler - Force updating UI after queue processing");
        window.dispatchEvent(new CustomEvent('force-task-update'));
        processingRef.current = false;
      }, 300);
    };
    
    // Start processing with a small delay
    setTimeout(processQueue, 50);
  }, [taskQueueRef.current.length]);
  
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
