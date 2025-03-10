
import React, { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventBus } from '@/lib/eventBus';

interface TaskLoaderProps {
  onTasksLoaded: (tasks: Task[]) => void;
  children: React.ReactNode;
}

export const TaskLoader: React.FC<TaskLoaderProps> = ({ 
  onTasksLoaded, 
  children 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDoneRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check for pending habits only once when component first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskLoader mounted, performing initial habits check');
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    // Load initial tasks from storage
    const storedTasks = taskStorage.loadTasks();
    console.log("TaskLoader - Initial load from storage:", storedTasks);
    onTasksLoaded(storedTasks);
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      
      // Force a UI update after a delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-task-update'));
        setIsLoading(false);
      }, 300);
    }, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [onTasksLoaded]);

  // Set up a loading timeout
  useEffect(() => {
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("TaskLoader - Loading timeout reached, forcing state to loaded");
        setIsLoading(false);
        
        // Force an update from storage
        const storedTasks = taskStorage.loadTasks();
        console.log("TaskLoader - Loaded tasks from storage after timeout:", storedTasks);
        onTasksLoaded(storedTasks);
        
        loadingTimeoutRef.current = null;
      }, 1000);
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading, onTasksLoaded]);

  // Add a loading state to prevent white screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return <>{children}</>;
};
