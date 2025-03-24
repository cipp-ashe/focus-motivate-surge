
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Task Verification Module
 * 
 * This module provides utilities for verifying and recovering task data
 * to ensure consistency between storage and memory.
 */
export const taskVerification = {
  /**
   * Recover missing tasks that are in storage but not in memory
   */
  recoverMissingTasks(currentTasks: Task[]): Task[] {
    const storedTasks = taskStorage.loadAllTasks();
    const currentTaskIds = new Set(currentTasks.map(t => t.id));
    
    // Find tasks that are in storage but not in memory
    const missingActiveTasks = storedTasks.active.filter(t => !currentTaskIds.has(t.id));
    
    // Return missing tasks
    return missingActiveTasks;
  },
  
  /**
   * Check for duplicate tasks in memory
   */
  findDuplicateTasks(currentTasks: Task[]): Task[] {
    const taskIds = new Set<string>();
    const duplicates: Task[] = [];
    
    for (const task of currentTasks) {
      if (taskIds.has(task.id)) {
        duplicates.push(task);
      } else {
        taskIds.add(task.id);
      }
    }
    
    return duplicates;
  },
  
  /**
   * Set up periodic verification to automatically recover missing tasks
   */
  setupPeriodicVerification(
    getTasksFn: () => Task[],
    onMissingTasks: (tasks: Task[]) => void,
    intervalMs: number = 60000
  ): () => void {
    const intervalId = setInterval(() => {
      const currentTasks = getTasksFn();
      const missingTasks = this.recoverMissingTasks(currentTasks);
      
      if (missingTasks.length > 0) {
        console.log(`[TaskVerification] Found ${missingTasks.length} missing tasks`);
        onMissingTasks(missingTasks);
      }
    }, intervalMs);
    
    return () => clearInterval(intervalId);
  },
  
  /**
   * Verify a specific task exists consistently in memory and storage
   */
  verifyTask(taskId: string, currentTasks: Task[]): { inMemory: boolean; inStorage: boolean } {
    const inMemory = currentTasks.some(t => t.id === taskId);
    const inStorage = !!taskStorage.getTaskById(taskId);
    
    return { inMemory, inStorage };
  },
  
  /**
   * Check for orphaned task relationships
   */
  findOrphanedRelationships(): any[] {
    // This would require access to relationship storage
    // Implementation would be specific to how relationships are stored
    return [];
  }
};
