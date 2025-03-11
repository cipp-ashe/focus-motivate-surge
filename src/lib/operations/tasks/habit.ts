
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { createTaskOperations } from './create';

/**
 * Operations related specifically to habit tasks
 */
export const habitTaskOperations = {
  /**
   * Create a task for a habit with proper storage and event emission
   * @param habitId The ID of the habit
   * @param templateId The ID of the template
   * @param name The name of the task
   * @param duration The duration of the task in seconds
   * @param date The date for the habit task
   * @param options Additional options for habit task creation
   * @returns The ID of the created task, or null if creation failed
   */
  createHabitTask(
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ): string | null {
    if (!habitId || !name || !date) {
      console.error('Invalid parameters for habit task creation');
      return null;
    }
    
    try {
      // Check if task already exists
      const existingTask = taskStorage.taskExists(habitId, date);
      if (existingTask) {
        console.log(`Task already exists for habit ${habitId} on ${date}`);
        
        // Select the existing task if requested
        if (options.selectAfterCreate) {
          eventManager.emit('task:select', existingTask.id);
        }
        
        return existingTask.id;
      }
      
      // Create new task with taskType specified and include createdAt
      const task = createTaskOperations.createTask({
        name,
        description: `Habit task for ${date}`,
        completed: false,
        duration,
        taskType: 'habit' as const, // Explicitly mark as habit task with const assertion
        createdAt: new Date().toISOString(), // Add the createdAt property
        relationships: {
          habitId,
          templateId,
          date
        }
      }, {
        suppressToast: options.suppressToast,
        selectAfterCreate: options.selectAfterCreate
      });
      
      return task.id;
    } catch (error) {
      console.error('Error creating habit task:', error);
      if (!options.suppressToast) {
        toast.error('Failed to create habit task');
      }
      return null;
    }
  }
};
