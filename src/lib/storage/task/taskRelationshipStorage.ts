
import { Task } from '@/types/tasks';
import { Note } from '@/types/notes';
import { EntityType } from '@/types/core';
import { constants } from './constants';
import { utils } from './utils';

/**
 * Service for managing task relationships
 */
export const taskRelationshipStorage = {
  /**
   * Check if a task exists for a specific habit and date
   * @param habitId The ID of the habit
   * @param date The date string
   * @returns The task if found, or null
   */
  taskExists: (habitId: string, date: string): Task | null => {
    try {
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);
      
      // Find task for the given habit and date
      const task = tasks.find((t: Task) => 
        t.relationships?.habitId === habitId && 
        t.relationships?.date === date
      );
      
      return task || null;
    } catch (error) {
      console.error('Error checking if task exists for habit:', error);
      return null;
    }
  },
  
  /**
   * Delete all tasks related to a specific template
   * @param templateId The ID of the template
   * @returns True if successful, false otherwise
   */
  deleteTasksByTemplate: (templateId: string): boolean => {
    try {
      // Load active tasks
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);
      
      // Filter out tasks related to the template
      const remainingTasks = tasks.filter((task: Task) => 
        task.relationships?.templateId !== templateId
      );
      
      // Check if any tasks were removed
      if (remainingTasks.length === tasks.length) {
        console.log(`No tasks found for template ${templateId}`);
        return false;
      }
      
      // Save remaining tasks
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, remainingTasks);
      console.log(`Deleted tasks for template ${templateId}`);
      
      // Also remove from completed tasks
      const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      const remainingCompleted = completedTasks.filter((task: Task) => 
        task.relationships?.templateId !== templateId
      );
      
      if (remainingCompleted.length !== completedTasks.length) {
        utils.saveToStorage(constants.COMPLETED_TASKS_KEY, remainingCompleted);
        console.log(`Also deleted completed tasks for template ${templateId}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting tasks by template:', error);
      return false;
    }
  },
  
  /**
   * Get notes linked to a specific task
   * @param taskId The ID of the task
   * @returns Array of linked notes
   */
  getLinkedNotes: (taskId: string): Note[] => {
    try {
      // Load notes from localStorage
      const notesJson = localStorage.getItem('notes');
      if (!notesJson) return [];
      
      const notes: Note[] = JSON.parse(notesJson);
      
      // Filter notes linked to the task
      return notes.filter(note => 
        Array.isArray(note.relationships) && 
        note.relationships.some(rel => 
          rel.entityId === taskId && 
          rel.entityType === EntityType.Task
        )
      );
    } catch (error) {
      console.error('Error getting linked notes:', error);
      return [];
    }
  }
};
