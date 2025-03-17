
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

export interface TaskInitialState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
}

/**
 * Task state management utilities
 */
export const taskState = {
  /**
   * Get the initial state for the task reducer
   */
  getInitialState: (): TaskInitialState => {
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
      const { active, completed } = taskStorage.loadAllTasks();
      
      return {
        items: active || [],
        completed: completed || []
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
   * Verify consistency between memory and storage
   */
  verifyConsistency: (memoryTasks: Task[]): Task[] => {
    try {
      // Find tasks that are in storage but not in memory
      return taskStorage.findMissingTasks(memoryTasks);
    } catch (error) {
      console.error('Error verifying task consistency:', error);
      return [];
    }
  }
};
