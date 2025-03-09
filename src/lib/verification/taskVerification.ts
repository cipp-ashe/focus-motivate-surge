
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Utility for verifying and recovering tasks
 */
export const taskVerification = {
  /**
   * Check if a task with given ID exists in the current task list
   */
  taskExists: (tasks: Task[], taskId: string): boolean => {
    return tasks.some(task => task.id === taskId);
  },
  
  /**
   * Check if a habit task exists for the given habit ID and date
   */
  habitTaskExists: (tasks: Task[], habitId: string, date: string): boolean => {
    return tasks.some(task => 
      task.relationships?.habitId === habitId && 
      task.relationships?.date === date
    );
  },
  
  /**
   * Verify that all tasks from storage are loaded in the current state
   */
  verifyAllTasksLoaded: (currentTasks: Task[]): boolean => {
    try {
      // Load tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Check if any stored tasks are missing from memory
      const missingTasks = storedTasks.filter((storageTask: Task) => 
        !currentTasks.some(memTask => memTask.id === storageTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`TaskVerification: Found ${missingTasks.length} tasks in storage missing from memory`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error verifying tasks:', error);
      return false;
    }
  },
  
  /**
   * Recover missing habit tasks by comparing memory tasks with storage
   */
  recoverMissingHabitTasks: (currentTasks: Task[]): Task[] => {
    try {
      // Load tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Find habit tasks that are in storage but not in memory
      const missingHabitTasks = storedTasks.filter((storageTask: Task) => 
        storageTask.relationships?.habitId && // Only habit tasks
        !currentTasks.some(memTask => 
          memTask.id === storageTask.id || 
          (memTask.relationships?.habitId === storageTask.relationships?.habitId && 
           memTask.relationships?.date === storageTask.relationships?.date)
        )
      );
      
      console.log(`TaskVerification: Found ${missingHabitTasks.length} habit tasks in storage missing from memory`);
      
      return missingHabitTasks;
    } catch (error) {
      console.error('Error recovering missing habit tasks:', error);
      return [];
    }
  },
  
  /**
   * Recover any missing tasks by comparing memory tasks with storage
   */
  recoverMissingTasks: (currentTasks: Task[]): Task[] => {
    try {
      // Load tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Find tasks that are in storage but not in memory
      const missingTasks = storedTasks.filter((storageTask: Task) => 
        !currentTasks.some(memTask => memTask.id === storageTask.id)
      );
      
      console.log(`TaskVerification: Found ${missingTasks.length} tasks in storage missing from memory`);
      
      return missingTasks;
    } catch (error) {
      console.error('Error recovering missing tasks:', error);
      return [];
    }
  },
  
  /**
   * Set up periodic verification to ensure tasks are properly loaded
   */
  setupPeriodicVerification: (
    getTasks: () => Task[],
    onMissingTasksFound: (tasks: Task[]) => void,
    interval: number = 60000
  ): (() => void) => {
    const intervalId = setInterval(() => {
      const currentTasks = getTasks();
      const missingTasks = taskVerification.recoverMissingTasks(currentTasks);
      
      if (missingTasks.length > 0) {
        console.log(`TaskVerification: Periodic check found ${missingTasks.length} missing tasks`);
        onMissingTasksFound(missingTasks);
      }
    }, interval);
    
    return () => clearInterval(intervalId);
  }
};
