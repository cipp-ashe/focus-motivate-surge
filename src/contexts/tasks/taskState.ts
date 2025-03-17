
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

// Task state module for centralized task state management
export const taskState = {
  /**
   * Get the initial state for the task reducer
   */
  getInitialState: () => {
    return {
      items: [],
      completed: [],
      selected: null,
      isLoaded: false
    };
  },

  /**
   * Load tasks from storage
   */
  loadFromStorage: () => {
    try {
      const items = taskStorage.loadTasks();
      const completed = taskStorage.loadCompletedTasks();
      
      return {
        items,
        completed
      };
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return {
        items: [],
        completed: []
      };
    }
  },

  /**
   * Save active tasks to storage
   */
  saveActiveTasks: (tasks: Task[]) => {
    try {
      return taskStorage.saveTasks(tasks);
    } catch (error) {
      console.error('Error saving active tasks:', error);
      return false;
    }
  },

  /**
   * Save completed tasks to storage
   */
  saveCompletedTasks: (tasks: Task[]) => {
    try {
      return taskStorage.saveCompletedTasks(tasks);
    } catch (error) {
      console.error('Error saving completed tasks:', error);
      return false;
    }
  },

  /**
   * Verify consistency between active tasks and storage
   */
  verifyConsistency: (activeTasks: Task[]) => {
    try {
      const storedTasks = taskStorage.loadTasks();
      
      // Find tasks in storage but not in active state
      const missingTasks = storedTasks.filter(storedTask => 
        !activeTasks.some(activeTask => activeTask.id === storedTask.id)
      );
      
      return missingTasks;
    } catch (error) {
      console.error('Error verifying task consistency:', error);
      return [];
    }
  }
};
