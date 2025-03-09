
import { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook to handle persisting tasks to localStorage with debouncing, atomic updates, and error handling
 */
export const useTaskPersistence = (
  items: Task[],
  completed: Task[]
) => {
  const isInitializingRef = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Persist changes to localStorage with debouncing and atomic updates
  useEffect(() => {
    // Don't persist during initialization
    if (isInitializingRef.current) {
      isInitializingRef.current = false;
      return;
    }
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce storage updates to avoid excessive writes
    saveTimeoutRef.current = setTimeout(() => {
      console.log(`TaskPersistence: Saving ${items.length} tasks to localStorage`);
      
      // Use the storage service to save both tasks and completed tasks
      taskStorage.saveTasks(items);
      taskStorage.saveCompletedTasks(completed);
    }, 50);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [items, completed]);
};
