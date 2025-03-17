
import React, { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

// Global flags for optimization
let taskLoaderInitialized = false;
let migrationRun = false;

interface TaskLoaderProps {
  onTasksLoaded: (tasks: Task[]) => void;
  children: React.ReactNode;
}

export const TaskLoader: React.FC<TaskLoaderProps> = ({ 
  onTasksLoaded, 
  children 
}) => {
  const [isLoading, setIsLoading] = useState(!taskLoaderInitialized);
  const initialCheckDoneRef = useRef(false);
  
  // Run task loading only once
  useEffect(() => {
    // Skip if already initialized globally
    if (taskLoaderInitialized) {
      setIsLoading(false);
      return;
    }
    
    // Set flag to prevent duplicate runs
    initialCheckDoneRef.current = true;
    
    try {
      // Fast, direct loading of tasks from storage
      const storedTasks = taskStorage.loadTasks();
      onTasksLoaded(storedTasks);
      
      // Mark as globally initialized immediately
      taskLoaderInitialized = true;
      setIsLoading(false);
      
      // Only run migration if not already done
      if (!migrationRun) {
        migrationRun = true;
        taskStorage.migrateTaskTypes();
      }
    } catch (error) {
      console.error("Error in initial task loading:", error);
      setIsLoading(false);
    }
  }, [onTasksLoaded]);

  // Add a short timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 1000); // Reduced from 2000ms to 1000ms
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

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
