
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
      
      // Find tasks that are in storage but not in memory by comparing IDs
      const missingTasks = tasksInStorage.filter(storageTask => 
        !tasksInMemory.some(memoryTask => memoryTask.id === storageTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`TaskStateVerifier: Found ${missingTasks.length} missing tasks`, missingTasks);
        
        // Log missing task types for debugging
        const missingTasksByType = {
          timer: missingTasks.filter(t => t.taskType === 'timer').length,
          journal: missingTasks.filter(t => t.taskType === 'journal').length,
          checklist: missingTasks.filter(t => t.taskType === 'checklist').length,
          screenshot: missingTasks.filter(t => t.taskType === 'screenshot').length,
          voicenote: missingTasks.filter(t => t.taskType === 'voicenote').length,
          regular: missingTasks.filter(t => !t.taskType || t.taskType === 'regular').length
        };
        console.log("TaskStateVerifier: Missing tasks by type:", missingTasksByType);
      }
      
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
      
      if (orphanedTasks.length > 0) {
        console.log(`TaskStateVerifier: Found ${orphanedTasks.length} orphaned tasks`, orphanedTasks);
        
        // Log orphaned task types for debugging
        const orphanedTasksByType = {
          timer: orphanedTasks.filter(t => t.taskType === 'timer').length,
          journal: orphanedTasks.filter(t => t.taskType === 'journal').length,
          checklist: orphanedTasks.filter(t => t.taskType === 'checklist').length,
          screenshot: orphanedTasks.filter(t => t.taskType === 'screenshot').length,
          voicenote: orphanedTasks.filter(t => t.taskType === 'voicenote').length,
          regular: orphanedTasks.filter(t => !t.taskType || t.taskType === 'regular').length
        };
        console.log("TaskStateVerifier: Orphaned tasks by type:", orphanedTasksByType);
      }
      
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
    if (tasksToAddToStorage.length > 0) {
      console.log(`TaskStateVerifier: Adding ${tasksToAddToStorage.length} orphaned tasks to storage`);
      tasksToAddToStorage.forEach(task => {
        taskStorage.addTask(task);
      });
    }
    
    // Log synchronization results
    if (tasksToAddToMemory.length > 0 || tasksToAddToStorage.length > 0) {
      console.log(`TaskStateVerifier: Synchronization complete - ${tasksToAddToMemory.length} tasks to add to memory, ${tasksToAddToStorage.length} tasks added to storage`);
    }
    
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
    intervalMs: number = 20000 // Reduce interval to 20 seconds (from 30 seconds)
  ): () => void {
    const intervalId = setInterval(() => {
      try {
        const tasksInMemory = getTasksInMemory();
        const missingTasks = this.findMissingTasks(tasksInMemory);
        
        if (missingTasks.length > 0) {
          console.log(`TaskVerification: Found ${missingTasks.length} tasks in storage missing from memory`);
          onTasksMissing(missingTasks);
          
          // Force a refresh
          window.dispatchEvent(new Event('force-task-update'));
        } else {
          console.log('TaskVerification: All tasks are in sync');
        }
        
        // Also check for orphaned tasks and save them to storage if needed
        const orphanedTasks = this.findOrphanedTasks(tasksInMemory);
        if (orphanedTasks.length > 0) {
          console.log(`TaskVerification: Saving ${orphanedTasks.length} orphaned tasks to storage`);
          orphanedTasks.forEach(task => {
            taskStorage.addTask(task);
          });
        }
      } catch (error) {
        console.error('Error in periodic task verification:', error);
      }
    }, intervalMs);
    
    return () => clearInterval(intervalId);
  }
};
