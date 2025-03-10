
import { Task } from '@/types/tasks';
import { constants } from './constants';
import { utils } from './utils';

/**
 * Service for managing task relationship storage operations
 */
export const taskRelationshipStorage = {
  /**
   * Check if a habit task exists by habitId and date
   */
  taskExists: (habitId: string, date: string): Task | null => {
    try {
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);
      const task = tasks.find((task: Task) => 
        task.relationships?.habitId === habitId && 
        task.relationships?.date === date
      );
      
      return task || null;
    } catch (error) {
      console.error('Error checking if habit task exists in storage:', error);
      return null;
    }
  },
  
  /**
   * Delete all tasks associated with a template
   */
  deleteTasksByTemplate: (templateId: string): boolean => {
    try {
      // Load active tasks
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);
      
      // Filter out tasks from this template
      const updatedTasks = tasks.filter((task: Task) => 
        task.relationships?.templateId !== templateId
      );
      
      // If no tasks were removed, return false
      if (updatedTasks.length === tasks.length) {
        console.log(`No tasks found for template ${templateId}`);
        return false;
      }
      
      // Save updated tasks
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, updatedTasks);
      
      // Also remove from completed tasks
      const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      const updatedCompletedTasks = completedTasks.filter((task: Task) => 
        task.relationships?.templateId !== templateId
      );
      
      utils.saveToStorage(constants.COMPLETED_TASKS_KEY, updatedCompletedTasks);
      
      console.log(`Removed ${tasks.length - updatedTasks.length} tasks for template ${templateId}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting tasks by template from storage:', error);
      return false;
    }
  },
};
