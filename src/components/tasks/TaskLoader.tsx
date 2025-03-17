
import React, { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';

// Global flag to track if task loader has initialized
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
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Run task type migration only once when component first mounts
  useEffect(() => {
    // Skip if already run globally
    if (migrationRun || taskLoaderInitialized) return;
    
    // Set flag immediately to prevent duplicate runs
    migrationRun = true;
    
    try {
      // Run the migration
      const migratedCount = taskStorage.migrateTaskTypes();
      
      if (migratedCount > 0) {
        // Force a UI update
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('force-task-update'));
        }, 100);
      }
    } catch (error) {
      console.error('Error in task migration:', error);
      // Continue even if migration fails
    }
  }, []);
  
  // Check for pending habits and load tasks when component first mounts
  useEffect(() => {
    // Skip if already initialized globally or locally
    if (initialCheckDoneRef.current || taskLoaderInitialized) {
      setIsLoading(false);
      return;
    }
    
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    try {
      // Load initial tasks from storage
      const storedTasks = taskStorage.loadTasks();
      onTasksLoaded(storedTasks);
      
      // Mark as globally initialized
      taskLoaderInitialized = true;
      
      // Check for pending habits after a delay
      const timeout = setTimeout(() => {
        try {
          // Only emit the event if we haven't initialized yet
          if (!taskLoaderInitialized) {
            eventManager.emit('habits:check-pending', {});
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error("Error in habits check:", error);
          setIsLoading(false);
        }
      }, 100);
      
      return () => {
        clearTimeout(timeout);
      };
    } catch (error) {
      console.error("Error in initial task loading:", error);
      setIsLoading(false);
    }
  }, [onTasksLoaded]);

  // Set up a loading timeout - this ensures we don't get stuck loading forever
  useEffect(() => {
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingTimeoutRef.current = null;
      }, 2000);
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
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
