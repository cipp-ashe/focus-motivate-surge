
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { createTaskOperations } from './create';
import { TaskType } from '@/types/tasks';

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
      taskType?: TaskType;
      metricType?: string;
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
      
      // Determine task type based on metric type
      let taskType = options.taskType || 'regular';
      
      // If it's a journal metric type, set task type to journal
      if (options.metricType === 'journal') {
        taskType = 'journal';
      }
      
      // Create new task with proper taskType and include createdAt
      const task = createTaskOperations.createTask({
        name,
        description: `Habit task for ${date}`,
        completed: false,
        duration,
        taskType, // Use the determined task type
        createdAt: new Date().toISOString(), // Add the createdAt property
        relationships: {
          habitId,
          templateId,
          date,
          metricType: options.metricType // Store the metric type in relationships
        }
      }, {
        suppressToast: options.suppressToast,
        selectAfterCreate: options.selectAfterCreate
      });
      
      // Add habit-related tags to the task for identification
      if (task.id) {
        // Add a 'habit' tag to identify it as a habit task
        eventManager.emit('tag:link', {
          tagId: 'habit',
          entityId: task.id,
          entityType: 'task'
        });
        
        // Also add template name as a tag if available
        if (templateId) {
          eventManager.emit('tag:link', {
            tagId: templateId,
            entityId: task.id,
            entityType: 'task'
          });
        }
        
        // If it's a journal task, add journal tag
        if (taskType === 'journal') {
          eventManager.emit('tag:link', {
            tagId: 'journal',
            entityId: task.id,
            entityType: 'task'
          });
        }
      }
      
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
