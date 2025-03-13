
import { Task } from '@/types/tasks';
import { constants } from './constants';

/**
 * Common utilities for task storage operations
 */
export const utils = {
  /**
   * Load data from localStorage with error handling
   */
  loadFromStorage: <T>(key: string, defaultValue: T): T => {
    try {
      const dataStr = localStorage.getItem(key);
      return dataStr ? JSON.parse(dataStr) : defaultValue;
    } catch (error) {
      console.error(`Error loading data from storage key ${key}:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Save data to localStorage with error handling
   */
  saveToStorage: <T>(key: string, data: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data to storage key ${key}:`, error);
      return false;
    }
  },
  
  /**
   * Format task metrics for display
   */
  formatTaskMetrics: (task: Task) => {
    if (!task.metrics) return null;
    
    return {
      completionStatus: task.metrics.completionStatus || 'Completed',
      formattedDuration: task.metrics.actualDuration ? 
        `${Math.floor(task.metrics.actualDuration / 60)}m ${task.metrics.actualDuration % 60}s` : 
        'N/A',
      completedAt: task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Unknown'
    };
  },
  
  /**
   * Check if a task is a habit task
   */
  isHabitTask: (task: Task): boolean => {
    return !!(task.relationships && task.relationships.habitId);
  },
  
  /**
   * Verify task integrity and fix any issues
   */
  verifyTaskIntegrity: (task: Task): Task => {
    // Ensure task has required properties
    return {
      ...task,
      taskType: task.taskType || 'regular',
      createdAt: task.createdAt || new Date().toISOString(),
      completed: !!task.completed,
      // Add any other integrity checks here
    };
  }
};
