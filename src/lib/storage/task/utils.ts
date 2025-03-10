
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
      const data = dataStr ? JSON.parse(dataStr) : defaultValue;
      return data;
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
  }
};
