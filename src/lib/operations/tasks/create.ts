
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Operations related to creating tasks
 */
export const createTaskOperations = {
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
   * Create a new task based on a completed task
   * @param completedTask The completed task to use as a template
   * @returns The newly created task
   */
  createFromCompleted(
    completedTask: Task,
    options: {
      suppressToast?: boolean;
      selectAfterCreate?: boolean;
    } = {}
  ): Task {
    console.log(`TaskOperations: Creating new task from completed task "${completedTask.name}"`);
    
    try {
      // Create a new task with similar properties but uncompleted
      const newTask: Task = this.createTask({
        name: completedTask.name,
        description: completedTask.description || '',
        completed: false,
        taskType: completedTask.taskType || 'regular',
        duration: completedTask.duration || 0,
        createdAt: new Date().toISOString(),
        // Copy relationships if they exist (except date for habit tasks)
        relationships: completedTask.relationships ? {
          ...completedTask.relationships,
          // Remove date for habit tasks to avoid conflicts
          date: undefined
        } : undefined,
        // Copy relevant fields based on task type
        ...(completedTask.taskType === 'checklist' && completedTask.checklistItems ? {
          checklistItems: completedTask.checklistItems.map(item => ({
            ...item,
            completed: false // Reset completion status
          }))
        } : {}),
        ...(completedTask.taskType === 'journal' ? {
          journalEntry: '' // Reset journal entry
        } : {})
      }, {
        suppressToast: options.suppressToast,
        selectAfterCreate: options.selectAfterCreate
      });
      
      return newTask;
    } catch (error) {
      console.error('Error creating task from completed task:', error);
      throw error;
    }
  }
};
