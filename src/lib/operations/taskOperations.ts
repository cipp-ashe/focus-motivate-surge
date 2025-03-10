
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Centralized module for task operations with improved reliability and consistency
 */
export const taskOperations = {
  /**
   * Create a new task with proper storage and event emission
   * @param task The task to create (without ID if it should be generated)
   * @param options Additional options for task creation
   * @returns The created task with ID
   */
  createTask(
    task: Omit<Task, 'id'> & { id?: string },
    options: { 
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ): Task {
    // Generate ID if not provided
    const newTask: Task = {
      id: task.id || uuidv4(),
      createdAt: task.createdAt || new Date().toISOString(),
      ...task
    };
    
    console.log(`TaskOperations: Creating task "${newTask.name}" (${newTask.id})`);
    
    try {
      // Save to storage first to ensure persistence
      taskStorage.addTask(newTask);
      
      // Emit task creation event
      eventManager.emit('task:create', newTask);
      
      // Select task if requested
      if (options.selectAfterCreate) {
        eventManager.emit('task:select', newTask.id);
      }
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Added task: ${newTask.name}`);
      }
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  },
  
  /**
   * Update an existing task with proper storage and event emission
   * @param taskId The ID of the task to update
   * @param updates The updates to apply to the task
   * @param options Additional options for task update
   */
  updateTask(
    taskId: string,
    updates: Partial<Task>,
    options: {
      suppressToast?: boolean;
    } = {}
  ): void {
    console.log(`TaskOperations: Updating task ${taskId}`, updates);
    
    try {
      // Get current task to ensure it exists
      const currentTask = taskStorage.getTaskById(taskId);
      if (!currentTask) {
        console.error(`Task ${taskId} not found for update`);
        return;
      }
      
      // Update in storage first to ensure persistence
      taskStorage.updateTask(taskId, { ...currentTask, ...updates });
      
      // Emit task update event
      eventManager.emit('task:update', { taskId, updates });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Updated task: ${currentTask.name}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  },
  
  /**
   * Delete a task with proper storage and event emission
   * @param taskId The ID of the task to delete
   * @param options Additional options for task deletion
   */
  deleteTask(
    taskId: string,
    options: {
      reason?: string;
      suppressToast?: boolean;
    } = {}
  ): void {
    console.log(`TaskOperations: Deleting task ${taskId}`, options);
    
    try {
      // Get task before deleting to show name in toast
      const task = taskStorage.getTaskById(taskId);
      if (!task) {
        console.warn(`Task ${taskId} not found for deletion`);
        return;
      }
      
      // Remove from storage first to ensure persistence
      taskStorage.removeTask(taskId);
      
      // Emit task deletion event
      eventManager.emit('task:delete', { 
        taskId, 
        reason: options.reason || 'user-action',
        suppressToast: options.suppressToast 
      });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Deleted task: ${task.name}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  },
  
  /**
   * Complete a task with proper storage and event emission
   * @param taskId The ID of the task to complete
   * @param metrics Optional metrics to save with the completed task
   * @param options Additional options for task completion
   */
  completeTask(
    taskId: string,
    metrics?: any,
    options: {
      suppressToast?: boolean;
    } = {}
  ): void {
    console.log(`TaskOperations: Completing task ${taskId}`, { metrics });
    
    try {
      // Get task before completing to show name in toast
      const task = taskStorage.getTaskById(taskId);
      if (!task) {
        console.warn(`Task ${taskId} not found for completion`);
        return;
      }
      
      // Update task to completed
      const completedTask = { ...task, completed: true };
      taskStorage.updateTask(taskId, completedTask);
      
      // Move to completed tasks
      taskStorage.moveToCompleted(taskId, metrics);
      
      // Emit task complete event
      eventManager.emit('task:complete', { taskId, metrics });
      
      // Show toast unless suppressed
      if (!options.suppressToast) {
        toast.success(`Completed task: ${task.name}`);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  },
  
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
      
      // Create new task
      const task = this.createTask({
        name,
        description: `Habit task for ${date}`,
        completed: false,
        duration,
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
