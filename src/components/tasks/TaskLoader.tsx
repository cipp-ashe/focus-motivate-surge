
import React, { useEffect, useRef, useState } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

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
  const migrationRunRef = useRef(false);
  const lastLoadTimeRef = useRef<number>(0);
  
  // Run task type migration only once when component first mounts
  useEffect(() => {
    if (migrationRunRef.current) return;
    
    console.log('Running task type migration...');
    migrationRunRef.current = true;
    
    try {
      // Run the migration
      const migratedCount = taskStorage.migrateTaskTypes();
      
      if (migratedCount > 0) {
        console.log(`Migrated ${migratedCount} tasks with invalid types`);
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
  
  // Function to reload tasks from storage
  const reloadTasksFromStorage = () => {
    try {
      const storedTasks = taskStorage.loadTasks();
      console.log("TaskLoader - Reloading tasks from storage:", storedTasks.length);
      
      onTasksLoaded(storedTasks);
      lastLoadTimeRef.current = Date.now();
      
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-task-update'));
      }, 100);
    } catch (error) {
      console.error("Error reloading tasks from storage:", error);
      // Don't break the app if tasks can't be loaded - continue with empty array
      onTasksLoaded([]);
    }
  };
  
  // Check for pending habits and load tasks when component first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskLoader mounted, performing initial tasks load and habits check');
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    try {
      // Load initial tasks from storage
      const storedTasks = taskStorage.loadTasks();
      console.log("TaskLoader - Initial load from storage:", storedTasks.length);
      onTasksLoaded(storedTasks);
      lastLoadTimeRef.current = Date.now();
      
      // Check for pending habits on mount with a small delay
      const timeout = setTimeout(() => {
        try {
          eventManager.emit('habits:check-pending', {});
          
          // Force a UI update after a delay
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('force-task-update'));
            setIsLoading(false);
          }, 300);
        } catch (error) {
          console.error("Error in habits check:", error);
          // Don't let this prevent the app from loading
          setIsLoading(false);
        }
      }, 100);
      
      return () => {
        clearTimeout(timeout);
      };
    } catch (error) {
      console.error("Error in initial task loading:", error);
      // Don't break the app if tasks can't be loaded
      setIsLoading(false);
    }
  }, [onTasksLoaded]);

  // Set up a loading timeout - this ensures we don't get stuck loading forever
  useEffect(() => {
    if (isLoading) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("TaskLoader - Loading timeout reached, forcing state to loaded");
        setIsLoading(false);
        
        // Try to reload from storage, but don't break if it fails
        try {
          reloadTasksFromStorage();
        } catch (error) {
          console.error("Error in forced reload:", error);
        }
        
        loadingTimeoutRef.current = null;
      }, 3000); // Increased timeout for slower devices
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
