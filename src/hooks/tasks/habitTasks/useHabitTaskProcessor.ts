
import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for processing habit tasks with improved localStorage synchronization,
 * error handling, and debouncing
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();
  const processingRef = useRef<Record<string, boolean>>({});
  const processingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Process a single habit task event with debouncing and improved error handling
  const processHabitTask = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  }) => {
    console.log(`Processing habit task schedule:`, event);
    
    // Generate a unique processing key for this habit-date combination
    const processingKey = `${event.habitId}-${event.date}`;
    
    // If we're already processing this exact habit-date combination, debounce
    if (processingRef.current[processingKey]) {
      console.log(`Already processing task for habit ${event.habitId} on ${event.date}, debouncing`);
      
      // Clear existing timeout if any
      if (processingTimeoutsRef.current[processingKey]) {
        clearTimeout(processingTimeoutsRef.current[processingKey]);
      }
      
      // Set new timeout to retry after a delay
      processingTimeoutsRef.current[processingKey] = setTimeout(() => {
        processHabitTask(event);
      }, 300);
      
      return;
    }
    
    // Mark as processing to prevent duplicates
    processingRef.current[processingKey] = true;
    
    try {
      // Check if task already exists using new storage service
      const existingTask = taskStorage.taskExists(event.habitId, event.date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}, skipping creation`);
        
        // Ensure task is loaded into memory state
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 50);
      } else {
        // Create the habit task using the creator hook
        createHabitTask(
          event.habitId,
          event.templateId,
          event.name,
          event.duration,
          event.date
        );
      }
    } catch (error) {
      console.error('Error processing habit task:', error);
    } finally {
      // Clean up processing state after a delay
      setTimeout(() => {
        delete processingRef.current[processingKey];
        if (processingTimeoutsRef.current[processingKey]) {
          clearTimeout(processingTimeoutsRef.current[processingKey]);
          delete processingTimeoutsRef.current[processingKey];
        }
      }, 500);
    }
  }, [createHabitTask]);
  
  // Handle habit schedule events from the event bus with prioritization
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  }) => {
    // Pass straight to processor 
    processHabitTask(event);
    
    // For critical habit scheduling events, set up a retry mechanism
    // to ensure the task is eventually created even if there are temporary issues
    const retryTimes = [300, 800, 1500]; // Exponential backoff
    
    retryTimes.forEach(delay => {
      setTimeout(() => {
        // Before retrying, check if the task exists now
        const existingTask = taskStorage.taskExists(event.habitId, event.date);
        
        if (!existingTask) {
          console.log(`Retry ${delay}ms: Task still not found for habit ${event.habitId}, retrying creation`);
          processHabitTask(event);
        }
      }, delay);
    });
  }, [processHabitTask]);
  
  // Process any pending tasks (useful after navigation or initial load)
  const processPendingTasks = useCallback(() => {
    console.log('Checking for any pending habit tasks...');
    
    try {
      // Use the storage service to check for habit tasks
      const allTasks = taskStorage.loadTasks();
      const habitTasks = allTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length > 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage, ensuring they're loaded in memory`);
        
        // Force multiple task updates with staggered timing for maximum reliability
        [100, 300, 600].forEach(delay => {
          setTimeout(() => {
            window.dispatchEvent(new Event('force-task-update'));
          }, delay);
        });
      }
    } catch (error) {
      console.error('Error processing pending tasks:', error);
      
      // Recovery mechanism - force an update anyway
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 500);
    }
  }, []);
  
  return { 
    processHabitTask,
    handleHabitSchedule,
    processPendingTasks
  };
};
