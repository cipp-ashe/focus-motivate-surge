
import { Task } from '@/types/tasks';
import { constants } from './constants';
import { utils } from './utils';

/**
 * Service for managing completed tasks storage
 */
export const completedTasksStorage = {
  /**
   * Load all completed tasks from localStorage
   */
  loadCompletedTasks: (): Task[] => {
    try {
      const tasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      console.log(`completedTasksStorage: Loaded ${tasks.length} completed tasks from storage`);
      return tasks;
    } catch (error) {
      console.error('Error loading completed tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Save completed tasks to localStorage
   */
  saveCompletedTasks: (tasks: Task[]): boolean => {
    try {
      console.log(`completedTasksStorage: Saving ${tasks.length} completed tasks to storage`);
      return utils.saveToStorage(constants.COMPLETED_TASKS_KEY, tasks);
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
      return false;
    }
  },
  
  /**
   * Add a completed task to storage
   */
  addCompletedTask: (task: Task): boolean => {
    try {
      // Load current completed tasks
      const tasks = completedTasksStorage.loadCompletedTasks();
      
      // Check if task with same ID already exists
      if (tasks.some((t: Task) => t.id === task.id)) {
        console.log(`Completed task with ID ${task.id} already exists in storage, skipping`);
        return false;
      }
      
      // Add task and save
      tasks.push(task);
      utils.saveToStorage(constants.COMPLETED_TASKS_KEY, tasks);
      console.log(`Completed task ${task.id} added to storage, new count: ${tasks.length}`);
      
      return true;
    } catch (error) {
      console.error('Error adding completed task to storage:', error);
      return false;
    }
  },
  
  /**
   * Remove a completed task from storage
   */
  removeCompletedTask: (taskId: string): boolean => {
    try {
      // Load current completed tasks
      const tasks = completedTasksStorage.loadCompletedTasks();
      
      // Check if task exists
      const taskExists = tasks.some((task: Task) => task.id === taskId);
      
      if (!taskExists) {
        console.log(`Completed task with ID ${taskId} not found in storage for removal`);
        return false;
      }
      
      // Remove task
      const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
      
      // Save updated tasks
      utils.saveToStorage(constants.COMPLETED_TASKS_KEY, updatedTasks);
      console.log(`Completed task ${taskId} removed from storage, new count: ${updatedTasks.length}`);
      
      return true;
    } catch (error) {
      console.error('Error removing completed task from storage:', error);
      return false;
    }
  }
};
