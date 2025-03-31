
import { Task } from '@/types/tasks';

/**
 * Utility functions for task storage
 */
export const utils = {
  /**
   * Save data to localStorage
   */
  saveToStorage: <T>(key: string, data: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data to localStorage key '${key}':`, error);
      return false;
    }
  },

  /**
   * Load data from localStorage
   */
  loadFromStorage: <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        return defaultValue;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading data from localStorage key '${key}':`, error);
      return defaultValue;
    }
  },

  /**
   * Normalize task data to handle type/taskType inconsistencies
   */
  normalizeTask: (task: any): Task => {
    // Create a copy of the task
    const normalizedTask: any = { ...task };

    // Handle type/taskType inconsistency
    if ('taskType' in normalizedTask && !('type' in normalizedTask)) {
      normalizedTask.type = normalizedTask.taskType;
    } else if ('type' in normalizedTask && !('taskType' in normalizedTask)) {
      normalizedTask.taskType = normalizedTask.type;
    } else if (!('type' in normalizedTask) && !('taskType' in normalizedTask)) {
      // Default to 'standard' if neither exists
      normalizedTask.type = 'standard';
      normalizedTask.taskType = 'standard';
    }

    // Replace 'regular' with 'standard' as the type
    if (normalizedTask.type === 'regular') {
      normalizedTask.type = 'standard';
    }
    if (normalizedTask.taskType === 'regular') {
      normalizedTask.taskType = 'standard';
    }

    // Ensure status is set
    if (!normalizedTask.status) {
      normalizedTask.status = normalizedTask.completed ? 'completed' : 'todo';
    }

    return normalizedTask as Task;
  },

  /**
   * Normalize an array of tasks
   */
  normalizeTasks: (tasks: any[]): Task[] => {
    return tasks.map(utils.normalizeTask);
  },

  /**
   * Remove redundant task fields (for storage optimization)
   */
  cleanupTaskForStorage: (task: Task): any => {
    // Create a copy to avoid modifying the original
    const cleanTask = { ...task };
    
    // Remove duplicated fields to save storage space
    if ('taskType' in cleanTask && cleanTask.taskType === cleanTask.type) {
      delete cleanTask.taskType;
    }
    
    return cleanTask;
  }
};
