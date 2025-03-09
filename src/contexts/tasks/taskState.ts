
import { Task } from '@/types/tasks';
import { TaskContextState } from './types';

/**
 * Task state manager with improved persistence and loading
 */
export const taskState = {
  /**
   * Load tasks from localStorage with improved error handling and logging
   */
  loadFromStorage: (): { tasks: Task[], completed: Task[] } => {
    try {
      console.log("TaskState: Loading tasks from localStorage");
      const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const completed = JSON.parse(localStorage.getItem('completedTasks') || '[]');
      
      console.log(`TaskState: Loaded ${tasks.length} tasks and ${completed.length} completed tasks`);
      return { tasks, completed };
    } catch (error) {
      console.error('TaskState: Error loading tasks from storage:', error);
      return { tasks: [], completed: [] };
    }
  },
  
  /**
   * Save tasks to localStorage with improved error handling
   */
  saveToStorage: (items: Task[], completed: Task[]): void => {
    try {
      console.log(`TaskState: Saving ${items.length} tasks to localStorage`);
      localStorage.setItem('taskList', JSON.stringify(items));
      localStorage.setItem('completedTasks', JSON.stringify(completed));
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
   * Verify consistency between localStorage and application state
   */
  verifyConsistency: (currentTasks: Task[]): Task[] => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      
      // Find tasks in localStorage but not in current state
      const missingTasks = storedTasks.filter((storedTask: Task) => 
        !currentTasks.some(memTask => memTask.id === storedTask.id)
      );
      
      if (missingTasks.length > 0) {
        console.log(`TaskState: Found ${missingTasks.length} tasks in localStorage missing from memory state`);
        return missingTasks;
      }
    } catch (error) {
      console.error('TaskState: Error verifying task consistency:', error);
    }
    
    return [];
  }
};
