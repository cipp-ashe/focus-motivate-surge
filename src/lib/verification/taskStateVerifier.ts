
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Service for verifying and ensuring consistency between tasks in memory and storage
 */
export const taskStateVerifier = {
  /**
   * Verify that all tasks in storage are present in memory
   * @param tasksInMemory The current tasks in application memory
   * @returns Array of tasks that are in storage but not in memory
   */
  findMissingTasks(tasksInMemory: Task[]): Task[] {
    try {
      // Get all tasks from storage
      const tasksInStorage = taskStorage.loadTasks();
      
      // Find tasks that are in storage but not in memory
      const missingTasks = tasksInStorage.filter(storageTask => 
        !tasksInMemory.some(memoryTask => memoryTask.id === storageTask.id)
      );
      
      return missingTasks;
    } catch (error) {
      console.error('Error in taskStateVerifier.findMissingTasks:', error);
      return [];
    }
  },
  
  /**
   * Verify that all tasks in memory are present in storage
   * @param tasksInMemory The current tasks in application memory
   * @returns Array of tasks that are in memory but not in storage
   */
  findOrphanedTasks(tasksInMemory: Task[]): Task[] {
    try {
      // Get all tasks from storage
      const tasksInStorage = taskStorage.loadTasks();
      const tasksInStorageIds = tasksInStorage.map(task => task.id);
      
      // Find tasks that are in memory but not in storage
      const orphanedTasks = tasksInMemory.filter(memoryTask => 
        !tasksInStorageIds.includes(memoryTask.id)
      );
      
      return orphanedTasks;
    } catch (error) {
      console.error('Error in taskStateVerifier.findOrphanedTasks:', error);
      return [];
    }
  },
  
  /**
   * Synchronize tasks between memory and storage
   * @param tasksInMemory The current tasks in application memory
   * @returns Object containing tasks to add to memory and tasks to add to storage
   */
  synchronizeTasks(tasksInMemory: Task[]): {
    tasksToAddToMemory: Task[];
    tasksToAddToStorage: Task[];
  } {
    const tasksToAddToMemory = this.findMissingTasks(tasksInMemory);
    const tasksToAddToStorage = this.findOrphanedTasks(tasksInMemory);
    
    // Add tasks to storage that are in memory but not in storage
    tasksToAddToStorage.forEach(task => {
      taskStorage.addTask(task);
    });
    
    return {
      tasksToAddToMemory,
      tasksToAddToStorage
    };
  },
  
  /**
   * Set up periodic verification to run at specified intervals
   * @param getTasksInMemory Function that returns the current tasks in memory
   * @param onTasksMissing Callback function called when missing tasks are found
   * @param intervalMs Interval in milliseconds to run verification
   * @returns Cleanup function to cancel the verification
   */
  setupPeriodicVerification(
    getTasksInMemory: () => Task[],
    onTasksMissing: (missingTasks: Task[]) => void,
    intervalMs: number = 60000
  ): () => void {
    const intervalId = setInterval(() => {
      try {
        const tasksInMemory = getTasksInMemory();
        const missingTasks = this.findMissingTasks(tasksInMemory);
        
        if (missingTasks.length > 0) {
          console.log(`TaskVerification: Found ${missingTasks.length} tasks in storage missing from memory`);
          onTasksMissing(missingTasks);
        } else {
          console.log('TaskVerification: All tasks are in sync');
        }
      } catch (error) {
        console.error('Error in periodic task verification:', error);
      }
    }, intervalMs);
    
    return () => clearInterval(intervalId);
  }
};
