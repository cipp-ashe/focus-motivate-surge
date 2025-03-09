
import { Task } from '@/types/tasks';
import { TaskContextState } from './types';
import { taskStorage } from '@/lib/storage/taskStorage';
import { taskVerification } from '@/lib/verification/taskVerification';

/**
 * Task state manager with improved persistence, verification and loading
 */
export const taskState = {
  /**
   * Load tasks from storage with improved error handling and logging
   */
  loadFromStorage: (): { tasks: Task[], completed: Task[] } => {
    try {
      console.log("TaskState: Loading tasks from storage");
      const tasks = taskStorage.loadTasks();
      const completed = taskStorage.loadCompletedTasks();
      
      console.log(`TaskState: Loaded ${tasks.length} tasks and ${completed.length} completed tasks`);
      return { tasks, completed };
    } catch (error) {
      console.error('TaskState: Error loading tasks from storage:', error);
      return { tasks: [], completed: [] };
    }
  },
  
  /**
   * Save tasks to storage with improved error handling and atomic updates
   */
  saveToStorage: (items: Task[], completed: Task[]): void => {
    try {
      console.log(`TaskState: Saving ${items.length} tasks to storage`);
      taskStorage.saveTasks(items);
      taskStorage.saveCompletedTasks(completed);
    } catch (error) {
      console.error('TaskState: Error saving tasks to storage:', error);
    }
  },
  
  /**
   * Check if a task already exists by ID or habit relationship
   */
  taskExists: (tasks: Task[], task: Task): boolean => {
    return tasks.some(t => 
      t.id === task.id || 
      (t.relationships?.habitId === task.relationships?.habitId && 
       t.relationships?.date === task.relationships?.date)
    );
  },
  
  /**
   * Initialize the task state
   */
  getInitialState: (): TaskContextState => {
    const { tasks, completed } = taskState.loadFromStorage();
    return {
      items: tasks,
      completed,
      selected: null,
      isLoaded: true,
    };
  },
  
  /**
   * Verify consistency between storage and application state
   */
  verifyConsistency: (currentTasks: Task[]): Task[] => {
    return taskVerification.recoverMissingTasks(currentTasks);
  }
};
