import { Task, TaskMetrics } from '@/types/tasks';

// Export constants for testing
export const ACTIVE_TASKS_KEY = 'taskList';
export const COMPLETED_TASKS_KEY = 'completedTasks';

/**
 * Service for managing task storage
 */
export const taskStorage = {
  /**
   * Load all tasks from localStorage
   */
  loadTasks: (): Task[] => {
    try {
      const tasksStr = localStorage.getItem(ACTIVE_TASKS_KEY);
      const tasks = tasksStr ? JSON.parse(tasksStr) : [];
      console.log(`taskStorage: Loaded ${tasks.length} tasks from storage`);
      return tasks;
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Load completed tasks from localStorage
   */
  loadCompletedTasks: (): Task[] => {
    try {
      const tasksStr = localStorage.getItem(COMPLETED_TASKS_KEY);
      return tasksStr ? JSON.parse(tasksStr) : [];
    } catch (error) {
      console.error('Error loading completed tasks from storage:', error);
      return [];
    }
  },
  
  /**
   * Save tasks to localStorage
   */
  saveTasks: (tasks: Task[]): boolean => {
    try {
      console.log(`taskStorage: Saving ${tasks.length} tasks to storage:`, tasks);
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      return false;
    }
  },
  
  /**
   * Save completed tasks to localStorage
   */
  saveCompletedTasks: (tasks: Task[]): boolean => {
    try {
      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
      return false;
    }
  },
  
  /**
   * Check if a task exists in storage by ID
   */
  taskExistsById: (taskId: string): boolean => {
    try {
      const tasks = taskStorage.loadTasks();
      const exists = tasks.some((task: Task) => task.id === taskId);
      console.log(`taskStorage: Task ${taskId} exists in storage: ${exists}`);
      return exists;
    } catch (error) {
      console.error('Error checking if task exists in storage:', error);
      return false;
    }
  },
  
  /**
   * Check if a habit task exists by habitId and date
   */
  taskExists: (habitId: string, date: string): Task | null => {
    try {
      const tasks = taskStorage.loadTasks();
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
   * Add a task to storage
   */
  addTask: (task: Task): boolean => {
    try {
      // Load current tasks
      const tasks = taskStorage.loadTasks();
      
      // Check if task with same ID already exists
      if (tasks.some((t: Task) => t.id === task.id)) {
        console.log(`Task with ID ${task.id} already exists in storage, skipping`);
        return false;
      }
      
      // If it's a habit task, check if one already exists for this habit and date
      if (task.relationships?.habitId && task.relationships?.date) {
        const habitId = task.relationships.habitId;
        const date = task.relationships.date;
        
        if (tasks.some((t: Task) => 
          t.relationships?.habitId === habitId && 
          t.relationships?.date === date
        )) {
          console.log(`Task for habit ${habitId} on ${date} already exists, skipping`);
          return false;
        }
      }
      
      // Add task and save
      tasks.push(task);
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(tasks));
      console.log(`Task ${task.id} added to storage, new count: ${tasks.length}`);
      
      return true;
    } catch (error) {
      console.error('Error adding task to storage:', error);
      return false;
    }
  },
  
  /**
   * Update a task in storage
   */
  updateTask: (taskId: string, updates: Partial<Task>): boolean => {
    try {
      // Load current tasks
      const tasks = taskStorage.loadTasks();
      
      // Find task index
      const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);
      
      if (taskIndex === -1) {
        console.log(`Task with ID ${taskId} not found in storage for update`);
        return false;
      }
      
      // Update task
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      
      // Save updated tasks
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(tasks));
      console.log(`Task ${taskId} updated in storage`);
      
      return true;
    } catch (error) {
      console.error('Error updating task in storage:', error);
      return false;
    }
  },
  
  /**
   * Remove a task from storage
   */
  removeTask: (taskId: string): boolean => {
    try {
      // Load current tasks
      const tasks = taskStorage.loadTasks();
      
      // Check if task exists
      const taskExists = tasks.some((task: Task) => task.id === taskId);
      
      if (!taskExists) {
        console.log(`Task with ID ${taskId} not found in storage for removal`);
        return false;
      }
      
      // Remove task
      const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
      
      // Save updated tasks
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(updatedTasks));
      console.log(`Task ${taskId} removed from storage, new count: ${updatedTasks.length}`);
      
      // Also check and remove from completed tasks if present
      const completedTasks = taskStorage.loadCompletedTasks();
      if (completedTasks.some((task: Task) => task.id === taskId)) {
        const updatedCompleted = completedTasks.filter((task: Task) => task.id !== taskId);
        localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompleted));
        console.log(`Task ${taskId} also removed from completed tasks`);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing task from storage:', error);
      return false;
    }
  },
  
  /**
   * Complete a task and move it to completed tasks
   */
  completeTask: (taskId: string, metrics?: TaskMetrics): boolean => {
    try {
      // Load active tasks
      const tasks = taskStorage.loadTasks();
      
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
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(tasks));
      
      // Add to completed tasks
      const completedTasks = taskStorage.loadCompletedTasks();
      completedTasks.push(completedTask);
      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(completedTasks));
      console.log(`Task ${taskId} marked as completed and moved to completed tasks`);
      
      return true;
    } catch (error) {
      console.error('Error completing task in storage:', error);
      return false;
    }
  },
  
  /**
   * Delete all tasks associated with a template
   */
  deleteTasksByTemplate: (templateId: string): boolean => {
    try {
      // Load active tasks
      const tasks = taskStorage.loadTasks();
      
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
      localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(updatedTasks));
      
      // Also remove from completed tasks
      const completedTasks = taskStorage.loadCompletedTasks();
      const updatedCompletedTasks = completedTasks.filter((task: Task) => 
        task.relationships?.templateId !== templateId
      );
      
      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(updatedCompletedTasks));
      
      console.log(`Removed ${tasks.length - updatedTasks.length} tasks for template ${templateId}`);
      
      return true;
    } catch (error) {
      console.error('Error deleting tasks by template from storage:', error);
      return false;
    }
  },
  
  /**
   * Find missing tasks that are in storage but not in memory
   */
  findMissingTasks: (memoryTasks: Task[]): Task[] => {
    try {
      const storedTasks = taskStorage.loadTasks();
      return storedTasks.filter((storedTask: Task) => 
        !memoryTasks.some(memTask => memTask.id === storedTask.id)
      );
    } catch (error) {
      console.error('Error finding missing tasks:', error);
      return [];
    }
  },
  
  /**
   * Clear all tasks from storage (for debugging and testing)
   */
  clearAllTasks: (): boolean => {
    try {
      localStorage.removeItem(ACTIVE_TASKS_KEY);
      localStorage.removeItem(COMPLETED_TASKS_KEY);
      console.log("All tasks cleared from storage");
      return true;
    } catch (error) {
      console.error('Error clearing all tasks from storage:', error);
      return false;
    }
  },
  
  /**
   * Get task by ID
   */
  getTaskById: (taskId: string): Task | null => {
    try {
      const tasks = taskStorage.loadTasks();
      const task = tasks.find((t: Task) => t.id === taskId);
      
      if (!task) {
        // Check completed tasks as well
        const completedTasks = taskStorage.loadCompletedTasks();
        return completedTasks.find((t: Task) => t.id === taskId) || null;
      }
      
      return task;
    } catch (error) {
      console.error('Error getting task by ID from storage:', error);
      return null;
    }
  },
};
