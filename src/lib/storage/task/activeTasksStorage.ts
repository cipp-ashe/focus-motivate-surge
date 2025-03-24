import { Task } from '@/types/tasks';
import { constants } from './constants';
import { utils } from './utils';

// Flag to track initial load logging
let initialLoadLogged = false;

/**
 * Service for managing active tasks storage
 */
export const activeTasksStorage = {
  /**
   * Load all tasks from localStorage
   */
  loadTasks: (): Task[] => {
    try {
      const tasks = utils.loadFromStorage<Task[]>(constants.ACTIVE_TASKS_KEY, []);

      // Only log on first load or if there are actually tasks
      if (!initialLoadLogged || tasks.length > 0) {
        initialLoadLogged = true;
        console.log(`taskStorage: Loaded ${tasks.length} tasks from storage`);
      }

      return tasks;
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  },

  /**
   * Save tasks to localStorage
   */
  saveTasks: (tasks: Task[]): boolean => {
    try {
      // Log task statuses to see if any dismissed tasks are being saved to active storage
      const dismissedTasks = tasks.filter((t) => t.status === 'dismissed');
      if (dismissedTasks.length > 0) {
        console.log(
          `WARNING: Found ${dismissedTasks.length} dismissed tasks in active tasks storage:`,
          dismissedTasks
        );
      }

      // Only log if we're saving a non-empty array
      if (tasks.length > 0) {
        console.log(
          `taskStorage: Saving ${tasks.length} tasks to storage with statuses:`,
          tasks.map((t) => ({ id: t.id, status: t.status }))
        );
      }

      return utils.saveToStorage(constants.ACTIVE_TASKS_KEY, tasks);
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      return false;
    }
  },

  /**
   * Check if a task exists in storage by ID
   */
  taskExistsById: (taskId: string): boolean => {
    try {
      const tasks = activeTasksStorage.loadTasks();
      const exists = tasks.some((task: Task) => task.id === taskId);
      console.log(`taskStorage: Task ${taskId} exists in storage: ${exists}`);
      return exists;
    } catch (error) {
      console.error('Error checking if task exists in storage:', error);
      return false;
    }
  },

  /**
   * Check if a task exists for a specific habit on a specific date
   */
  taskExists: (habitId: string, date: string): Task | null => {
    try {
      const tasks = activeTasksStorage.loadTasks();
      console.log(
        `Checking for task with habitId=${habitId}, date=${date} among ${tasks.length} tasks`
      );

      // Check active tasks
      const existingTask = tasks.find(
        (task: Task) => task.relationships?.habitId === habitId && task.relationships?.date === date
      );

      if (existingTask) {
        console.log(`Found existing task ${existingTask.id} for habit ${habitId} on ${date}`);
        return existingTask;
      }

      // Also check completed tasks
      const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      const completedTask = completedTasks.find(
        (task: Task) => task.relationships?.habitId === habitId && task.relationships?.date === date
      );

      if (completedTask) {
        console.log(`Found completed task ${completedTask.id} for habit ${habitId} on ${date}`);
        return completedTask;
      }

      console.log(`No task found for habit ${habitId} on ${date}`);
      return null;
    } catch (error) {
      console.error('Error checking if task exists for habit:', error);
      return null;
    }
  },

  /**
   * Get task by ID (checks both active and completed tasks)
   */
  getTaskById: (taskId: string): Task | null => {
    try {
      const tasks = activeTasksStorage.loadTasks();
      const task = tasks.find((t: Task) => t.id === taskId);

      if (!task) {
        // Check completed tasks as well
        const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
        return completedTasks.find((t: Task) => t.id === taskId) || null;
      }

      return task;
    } catch (error) {
      console.error('Error getting task by ID from storage:', error);
      return null;
    }
  },

  /**
   * Add a task to storage
   */
  addTask: (task: Task): boolean => {
    try {
      // Load current tasks
      const tasks = activeTasksStorage.loadTasks();

      // Check if task with same ID already exists
      if (tasks.some((t: Task) => t.id === task.id)) {
        console.log(`Task with ID ${task.id} already exists in storage, skipping`);
        return false;
      }

      // If it's a habit task, check if one already exists for this habit and date
      if (task.relationships?.habitId && task.relationships?.date) {
        const habitId = task.relationships.habitId;
        const date = task.relationships.date;

        if (
          tasks.some(
            (t: Task) => t.relationships?.habitId === habitId && t.relationships?.date === date
          )
        ) {
          console.log(`Task for habit ${habitId} on ${date} already exists, skipping`);
          return false;
        }
      }

      // Add task and save
      tasks.push(task);
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, tasks);
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
      const tasks = activeTasksStorage.loadTasks();

      console.log(`activeTasksStorage: Updating task ${taskId} with updates:`, updates);

      // Find task index
      const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);

      if (taskIndex === -1) {
        console.log(`Task with ID ${taskId} not found in active tasks storage for update`);

        // Check if it's in completed tasks
        const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
        const completedTaskIndex = completedTasks.findIndex((task: Task) => task.id === taskId);

        if (completedTaskIndex !== -1) {
          console.log(
            `Task with ID ${taskId} found in completed tasks storage, updating there instead`
          );
          completedTasks[completedTaskIndex] = {
            ...completedTasks[completedTaskIndex],
            ...updates,
          };
          return utils.saveToStorage(constants.COMPLETED_TASKS_KEY, completedTasks);
        }

        console.log(`Task with ID ${taskId} not found in any storage for update`);
        return false;
      }

      // Update task
      const originalTask = tasks[taskIndex];
      const updatedTask = { ...originalTask, ...updates };
      console.log(`activeTasksStorage: Task before update:`, originalTask);
      console.log(`activeTasksStorage: Task after update:`, updatedTask);

      // Check if this is a task that should be moved to completed
      if (
        updatedTask.status === 'completed' ||
        updatedTask.status === 'dismissed' ||
        updatedTask.completed === true
      ) {
        console.log(
          `activeTasksStorage: Task ${taskId} should be moved to completed tasks due to status: ${updatedTask.status}`
        );

        // Remove from active tasks
        const remainingTasks = tasks.filter((task: Task) => task.id !== taskId);
        utils.saveToStorage(constants.ACTIVE_TASKS_KEY, remainingTasks);

        // Add to completed tasks
        const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
        completedTasks.unshift(updatedTask);
        return utils.saveToStorage(constants.COMPLETED_TASKS_KEY, completedTasks);
      }

      // Otherwise just update in active tasks
      tasks[taskIndex] = updatedTask;

      // Save updated tasks
      return utils.saveToStorage(constants.ACTIVE_TASKS_KEY, tasks);
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
      const tasks = activeTasksStorage.loadTasks();

      // Check if task exists
      const taskExists = tasks.some((task: Task) => task.id === taskId);

      if (!taskExists) {
        console.log(`Task with ID ${taskId} not found in storage for removal`);
        return false;
      }

      // Remove task
      const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);

      // Save updated tasks
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, updatedTasks);
      console.log(`Task ${taskId} removed from storage, new count: ${updatedTasks.length}`);

      // Also check and remove from completed tasks if present
      const completedTasks = utils.loadFromStorage<Task[]>(constants.COMPLETED_TASKS_KEY, []);
      if (completedTasks.some((task: Task) => task.id === taskId)) {
        const updatedCompleted = completedTasks.filter((task: Task) => task.id !== taskId);
        utils.saveToStorage(constants.COMPLETED_TASKS_KEY, updatedCompleted);
        console.log(`Task ${taskId} also removed from completed tasks`);
      }

      return true;
    } catch (error) {
      console.error('Error removing task from storage:', error);
      return false;
    }
  },

  /**
   * Find missing tasks that are in storage but not in memory
   */
  findMissingTasks: (memoryTasks: Task[]): Task[] => {
    try {
      const storedTasks = activeTasksStorage.loadTasks();
      return storedTasks.filter(
        (storedTask: Task) => !memoryTasks.some((memTask) => memTask.id === storedTask.id)
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
      localStorage.removeItem(constants.ACTIVE_TASKS_KEY);
      localStorage.removeItem(constants.COMPLETED_TASKS_KEY);
      console.log('All tasks cleared from storage');
      return true;
    } catch (error) {
      console.error('Error clearing all tasks from storage:', error);
      return false;
    }
  },
};
