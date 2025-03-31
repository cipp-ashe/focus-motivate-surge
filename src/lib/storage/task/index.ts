
/**
 * Unified Task Storage Module
 * 
 * This module provides a consistent API for all task storage operations,
 * serving as the single source of truth for task persistence.
 */

// Import storage implementations
import { activeTasksStorage } from './activeTasksStorage';
import { completedTasksStorage } from './completedTasksStorage';
import { taskRelationshipStorage } from './taskRelationshipStorage';
import { constants } from './constants';
import { migrateTaskTypes } from './taskMigration';
import { Task } from '@/types/tasks';

/**
 * Consolidated task storage API
 * Provides a unified interface for all task storage operations
 */
export const taskStorage = {
  /**
   * Load active tasks from storage
   */
  loadTasks: activeTasksStorage.loadTasks,
  
  /**
   * Save active tasks to storage
   */
  saveTasks: activeTasksStorage.saveTasks,
  
  /**
   * Add a single task to storage
   */
  addTask: activeTasksStorage.addTask,
  
  /**
   * Update a task in storage
   */
  updateTask: activeTasksStorage.updateTask,
  
  /**
   * Remove a task from storage
   */
  removeTask: activeTasksStorage.removeTask,
  
  /**
   * Get a task by ID
   */
  getTaskById: activeTasksStorage.getTaskById,
  
  /**
   * Load completed tasks
   */
  loadCompletedTasks: completedTasksStorage.loadCompletedTasks,
  
  /**
   * Save completed tasks
   */
  saveCompletedTasks: completedTasksStorage.saveCompletedTasks,
  
  /**
   * Add a completed task
   */
  addCompletedTask: completedTasksStorage.addCompletedTask,
  
  /**
   * Remove a completed task
   */
  removeCompletedTask: completedTasksStorage.removeCompletedTask,
  
  /**
   * Get task relationships
   */
  getTaskRelationships: taskRelationshipStorage.getTaskRelationships,
  
  /**
   * Save task relationships
   */
  saveTaskRelationships: taskRelationshipStorage.saveTaskRelationships,
  
  /**
   * Get tasks by relationship
   */
  getTasksByRelationship: taskRelationshipStorage.getTasksByRelationship,
  
  /**
   * Run migration for task types
   */
  migrateTaskTypes,
  
  /**
   * Load all tasks at once (active and completed)
   */
  loadAllTasks: (): { active: Task[], completed: Task[] } => {
    const active = activeTasksStorage.loadTasks();
    const completed = completedTasksStorage.loadCompletedTasks();
    return { active, completed };
  },
};

// Export constants for reference
export const { ACTIVE_TASKS_KEY, COMPLETED_TASKS_KEY } = constants;

// Export direct access to individual storage modules for advanced use cases
export { activeTasksStorage, completedTasksStorage, taskRelationshipStorage };
