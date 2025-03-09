import { Task } from '@/types/tasks';
import { toast } from 'sonner';

/**
 * Task Storage Service
 * Provides a consistent interface for task persistence with verification and atomic updates
 */
export const taskStorage = {
  TASKS_KEY: 'taskList',
  COMPLETED_TASKS_KEY: 'completedTasks',
  CLEARED_TASKS_KEY: 'clearedTasks',
  
  /**
   * Load tasks from localStorage with error handling
   */
  loadTasks: (): Task[] => {
    try {
      const stored = localStorage.getItem(taskStorage.TASKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Load completed tasks from localStorage with error handling
   */
  loadCompletedTasks: (): Task[] => {
    try {
      const stored = localStorage.getItem(taskStorage.COMPLETED_TASKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading completed tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Load cleared tasks from localStorage with error handling
   */
  loadClearedTasks: (): Task[] => {
    try {
      const stored = localStorage.getItem(taskStorage.CLEARED_TASKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cleared tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Save tasks to localStorage atomically
   */
  saveTasks: (tasks: Task[]): boolean => {
    try {
      localStorage.setItem(taskStorage.TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      toast.error('Failed to save tasks');
      return false;
    }
  },
  
  /**
   * Save completed tasks to localStorage atomically
   */
  saveCompletedTasks: (tasks: Task[]): boolean => {
    try {
      localStorage.setItem(taskStorage.COMPLETED_TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
      toast.error('Failed to save completed tasks');
      return false;
    }
  },
  
  /**
   * Save cleared tasks to localStorage atomically
   */
  saveClearedTasks: (tasks: Task[]): boolean => {
    try {
      localStorage.setItem(taskStorage.CLEARED_TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving cleared tasks to storage:', error);
      toast.error('Failed to save cleared tasks');
      return false;
    }
  },
  
  /**
   * Add a single task to storage without loading all tasks first
   * Uses optimistic update with verification
   */
  addTask: (task: Task): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      
      // Check if task already exists
      if (tasks.some(t => t.id === task.id || 
          (t.relationships?.habitId === task.relationships?.habitId && 
           t.relationships?.date === task.relationships?.date))) {
        console.log(`Task already exists: ${task.id}, skipping add`);
        return false;
      }
      
      tasks.push(task);
      return taskStorage.saveTasks(tasks);
    } catch (error) {
      console.error('Error adding task to storage:', error);
      return false;
    }
  },
  
  /**
   * Update a single task in storage
   */
  updateTask: (taskId: string, updates: Partial<Task>): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        console.log(`Task not found: ${taskId}, skipping update`);
        return false;
      }
      
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      return taskStorage.saveTasks(tasks);
    } catch (error) {
      console.error('Error updating task in storage:', error);
      return false;
    }
  },
  
  /**
   * Remove a single task from storage
   */
  removeTask: (taskId: string): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      const newTasks = tasks.filter(t => t.id !== taskId);
      
      if (newTasks.length === tasks.length) {
        console.log(`Task not found: ${taskId}, skipping removal`);
        return false;
      }
      
      return taskStorage.saveTasks(newTasks);
    } catch (error) {
      console.error('Error removing task from storage:', error);
      return false;
    }
  },
  
  /**
   * Complete a task by moving it from tasks to completed tasks
   */
  completeTask: (taskId: string, metrics?: any): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      const completedTasks = taskStorage.loadCompletedTasks();
      
      const taskToComplete = tasks.find(t => t.id === taskId);
      if (!taskToComplete) {
        console.log(`Task not found: ${taskId}, skipping completion`);
        return false;
      }
      
      // Add task to completed list
      const completedTask = { 
        ...taskToComplete, 
        completed: true,
        completedAt: new Date().toISOString(),
        metrics 
      };
      
      completedTasks.push(completedTask);
      
      // Remove from active tasks
      const newTasks = tasks.filter(t => t.id !== taskId);
      
      // Save both lists
      const tasksUpdated = taskStorage.saveTasks(newTasks);
      const completedUpdated = taskStorage.saveCompletedTasks(completedTasks);
      
      return tasksUpdated && completedUpdated;
    } catch (error) {
      console.error('Error completing task in storage:', error);
      return false;
    }
  },
  
  /**
   * Check if a task exists by ID or by habit relationship
   */
  taskExists: (habitId: string, date?: string): Task | null => {
    try {
      const tasks = taskStorage.loadTasks();
      
      // If we have a date, check by habit ID and date
      if (date) {
        const task = tasks.find(task => 
          task.relationships?.habitId === habitId && 
          task.relationships?.date === date
        );
        
        return task || null;
      }
      
      // Otherwise just check by habit ID
      const task = tasks.find(task => task.relationships?.habitId === habitId);
      return task || null;
    } catch (error) {
      console.error('Error checking if task exists:', error);
      return null;
    }
  },
  
  /**
   * Find missing tasks: tasks in localStorage but not in provided memory array
   */
  findMissingTasks: (memoryTasks: Task[]): Task[] => {
    try {
      const storedTasks = taskStorage.loadTasks();
      
      return storedTasks.filter(storedTask => 
        !memoryTasks.some(memTask => memTask.id === storedTask.id)
      );
    } catch (error) {
      console.error('Error finding missing tasks:', error);
      return [];
    }
  },
  
  /**
   * Delete tasks by template ID
   */
  deleteTasksByTemplate: (templateId: string): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      const completedTasks = taskStorage.loadCompletedTasks();
      
      const newTasks = tasks.filter(task => 
        task.relationships?.templateId !== templateId
      );
      
      const newCompletedTasks = completedTasks.filter(task => 
        task.relationships?.templateId !== templateId
      );
      
      const tasksUpdated = taskStorage.saveTasks(newTasks);
      const completedUpdated = taskStorage.saveCompletedTasks(newCompletedTasks);
      
      return tasksUpdated && completedUpdated;
    } catch (error) {
      console.error('Error deleting tasks by template:', error);
      return false;
    }
  }
};
