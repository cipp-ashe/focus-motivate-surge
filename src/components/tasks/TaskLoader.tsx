
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
    
    // Run the migration
    const migratedCount = taskStorage.migrateTaskTypes();
    
    if (migratedCount > 0) {
      console.log(`Migrated ${migratedCount} tasks with invalid types`);
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-task-update'));
      }, 100);
    }
  }, []);
  
  // Set up periodic task refreshes with more frequent updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only refresh if we're not currently loading and enough time has passed
      if (!isLoading && Date.now() - lastLoadTimeRef.current > 10000) { // Reduced from 15000 to 10000 ms
        console.log("TaskLoader - Periodic refresh triggered");
        reloadTasksFromStorage();
      }
    }, 20000); // Reduced from 30000 to 20000 ms
    
    return () => clearInterval(refreshInterval);
  }, [isLoading]);
  
  // Function to reload tasks from storage
  const reloadTasksFromStorage = () => {
    try {
      const storedTasks = taskStorage.loadTasks();
      console.log("TaskLoader - Reloading tasks from storage:", storedTasks);
      
      // Log task types for debugging
      const tasksByType = {
        timer: storedTasks.filter(t => t.taskType === 'timer').length,
        journal: storedTasks.filter(t => t.taskType === 'journal').length,
        checklist: storedTasks.filter(t => t.taskType === 'checklist').length,
        screenshot: storedTasks.filter(t => t.taskType === 'screenshot').length,
        voicenote: storedTasks.filter(t => t.taskType === 'voicenote').length,
        regular: storedTasks.filter(t => !t.taskType || t.taskType === 'regular').length
      };
      console.log("TaskLoader - Tasks by type:", tasksByType);
      
      onTasksLoaded(storedTasks);
      lastLoadTimeRef.current = Date.now();
      
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 100);
    } catch (error) {
      console.error("Error reloading tasks from storage:", error);
      toast.error("Error refreshing tasks");
    }
  };
  
  // Check for pending habits and load tasks when component first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskLoader mounted, performing initial tasks load and habits check');
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    // Load initial tasks from storage
    const storedTasks = taskStorage.loadTasks();
    console.log("TaskLoader - Initial load from storage:", storedTasks);
    onTasksLoaded(storedTasks);
    lastLoadTimeRef.current = Date.now();
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      eventManager.emit('habits:check-pending', {});
      
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
        reloadTasksFromStorage();
        
        loadingTimeoutRef.current = null;
      }, 800); // Reduced from 1000 to 800 ms
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
