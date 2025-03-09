
import { Task } from '@/types/tasks';
import { taskStorage } from '../storage/taskStorage';
import { toast } from 'sonner';

/**
 * Task Verification Service
 * 
 * Provides utilities to verify task data consistency between memory and storage
 */
export const taskVerification = {
  /**
   * Verify that all tasks in storage are loaded in memory
   * Returns true if all tasks are loaded, false otherwise
   */
  verifyAllTasksLoaded: (memoryTasks: Task[]): boolean => {
    try {
      console.log('Verifying all tasks are loaded...');
      
      // Get tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Find tasks in storage but not in memory
      const missingTasks = storedTasks.filter(storedTask => 
        !memoryTasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`Found ${missingTasks.length} tasks in storage missing from memory`);
        return false;
      }
      
      console.log('All tasks are properly loaded in memory');
      return true;
    } catch (error) {
      console.error('Error verifying task loading:', error);
      return false;
    }
  },
  
  /**
   * Find and recover missing tasks
   * Returns the list of recovered tasks
   */
  recoverMissingTasks: (memoryTasks: Task[]): Task[] => {
    try {
      console.log('Looking for missing tasks to recover...');
      
      // Get tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Find tasks in storage but not in memory
      const missingTasks = storedTasks.filter(storedTask => 
        !memoryTasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`Recovering ${missingTasks.length} missing tasks`);
        
        // Notify the user if we recovered a significant number of tasks
        if (missingTasks.length > 1) {
          toast.info(`Recovered ${missingTasks.length} tasks`, {
            description: "Your tasks have been synchronized."
          });
        }
        
        return missingTasks;
      }
      
      return [];
    } catch (error) {
      console.error('Error recovering missing tasks:', error);
      return [];
    }
  },
  
  /**
   * Find and recover missing habit tasks specifically
   * Returns the list of recovered habit tasks
   */
  recoverMissingHabitTasks: (memoryTasks: Task[]): Task[] => {
    try {
      console.log('Looking for missing habit tasks to recover...');
      
      // Get tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Find habit tasks in storage but not in memory
      const missingTasks = storedTasks.filter(storedTask => 
        storedTask.relationships?.habitId && 
        !memoryTasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`Recovering ${missingTasks.length} missing habit tasks`);
        
        // Notify the user if we recovered a significant number of tasks
        if (missingTasks.length > 0) {
          toast.info(`Recovered ${missingTasks.length} habit tasks`, {
            description: "Your habit tasks have been synchronized."
          });
        }
        
        return missingTasks;
      }
      
      return [];
    } catch (error) {
      console.error('Error recovering missing habit tasks:', error);
      return [];
    }
  },
  
  /**
   * Verify and recover tasks on a scheduled basis
   * Sets up an interval to periodically check for and recover missing tasks
   */
  setupPeriodicVerification: (
    getMemoryTasks: () => Task[],
    onMissingTasksFound: (tasks: Task[]) => void,
    interval = 60000 // Default: 1 minute
  ): () => void => {
    console.log(`Setting up periodic task verification every ${interval/1000} seconds`);
    
    const intervalId = setInterval(() => {
      const memoryTasks = getMemoryTasks();
      const missingTasks = taskVerification.recoverMissingTasks(memoryTasks);
      
      if (missingTasks.length > 0) {
        console.log(`Periodic verification found ${missingTasks.length} missing tasks`);
        onMissingTasksFound(missingTasks);
      }
    }, interval);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }
};
