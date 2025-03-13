
/**
 * Task Operations Module
 * 
 * This module exports a unified API for task operations, abstracting the implementation
 * details of each operation type. It serves as the public interface for task-related
 * operations throughout the application.
 * 
 * @module taskOperations
 */

// Re-export all task operations from their modules to maintain the existing API
import { createTaskOperations } from './create';
import { updateTaskOperations } from './update';
import { deleteTaskOperations } from './delete';
import { completeTaskOperations } from './complete';
import { habitTaskOperations } from './habit';

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
  createHabitTask: habitTaskOperations.createHabitTask
};
