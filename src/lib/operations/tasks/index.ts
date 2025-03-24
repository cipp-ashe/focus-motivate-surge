
/**
 * Task Operations Module
 * 
 * This module exports a unified API for task operations, abstracting the implementation
 * details of each operation type. It serves as the public interface for task-related
 * operations throughout the application.
 * 
 * @module taskOperations
 */

import { createTaskOperations } from './create';
import { updateTaskOperations } from './update';
import { deleteTaskOperations } from './delete';
import { completeTaskOperations } from './complete';
import { habitTaskOperations } from './habit';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';

/**
 * Combined task operations object providing a unified API
 * for all task-related actions in the application
 */
export const taskOperations = {
  /**
   * Create a new task
   * @see createTaskOperations.createTask
   */
  createTask: createTaskOperations.createTask,
  
  /**
   * Create a new task from a completed task
   * @see createTaskOperations.createFromCompleted
   */
  createFromCompleted: createTaskOperations.createFromCompleted,
  
  /**
   * Update an existing task
   * @see updateTaskOperations.updateTask
   */
  updateTask: updateTaskOperations.updateTask,
  
  /**
   * Delete a task
   * @see deleteTaskOperations.deleteTask
   */
  deleteTask: deleteTaskOperations.deleteTask,
  
  /**
   * Complete a task
   * @see completeTaskOperations.completeTask
   */
  completeTask: completeTaskOperations.completeTask,
  
  /**
   * Create a task linked to a habit
   * @see habitTaskOperations.createHabitTask
   */
  createHabitTask: habitTaskOperations.createHabitTask,

  /**
   * Get the unified task manager hook
   * This provides access to the full unified task manager API
   */
  useUnifiedTaskManager
};

// Export the individual operation modules for direct access
export { createTaskOperations, updateTaskOperations, deleteTaskOperations, completeTaskOperations, habitTaskOperations };

// Export the unified task manager hook directly for convenience
export { useUnifiedTaskManager };
