
import { Task, TaskMetrics } from '@/types/tasks';
import { constants } from './constants';
import { utils } from './utils';

/**
 * Service for managing completed tasks storage
 */
export const completedTasksStorage = {
  /**
   * Load completed tasks from localStorage
   */
  loadCompletedTasks: (): Task[] => {
    try {
      const tasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
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
      return utils.saveToStorage(constants.COMPLETED_TASKS_KEY, tasks);
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
      return false;
    }
  },
  
  /**
   * Complete a task and move it to completed tasks
   */
  completeTask: (taskId: string, metrics?: TaskMetrics): boolean => {
    try {
      // Load active tasks
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);
      
      // Find task
      const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);
      
      if (taskIndex === -1) {
        console.log(`Task with ID ${taskId} not found in storage for completion`);
        return false;
      }
      
      // Get task and mark as completed
      const task = tasks[taskIndex];
      const completedTask: Task = {
        ...task,
        completed: true,
        metrics,
        // Ensuring type safety for clearReason
        clearReason: "completed" as "completed" | "manual"
      };
      
      // Remove from active tasks
      tasks.splice(taskIndex, 1);
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, tasks);
      
      // Add to completed tasks
      const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      completedTasks.push(completedTask);
      utils.saveToStorage(constants.COMPLETED_TASKS_KEY, completedTasks);
      console.log(`Task ${taskId} marked as completed and moved to completed tasks`);
      
      return true;
    } catch (error) {
      console.error('Error completing task in storage:', error);
      return false;
    }
  },
};
