
import { activeTasksStorage } from './activeTasksStorage';
import { completedTasksStorage } from './completedTasksStorage';
import { taskRelationshipStorage } from './taskRelationshipStorage';
import { constants } from './constants';
import { migrateTaskTypes } from './taskMigration';
import { Task } from '@/types/tasks';

// Export all storage modules with a unified interface
export const taskStorage = {
  ...activeTasksStorage,
  ...completedTasksStorage,
  ...taskRelationshipStorage,
  migrateTaskTypes, // Export the migration utility
  
  // Add a convenience method to load all tasks at once
  loadAllTasks: (): { active: Task[], completed: Task[] } => {
    const active = activeTasksStorage.loadTasks();
    const completed = completedTasksStorage.loadCompletedTasks();
    return { active, completed };
  },
  
  // Alias getTaskById for backward compatibility
  getTaskById: (taskId: string): Task | null => {
    return activeTasksStorage.getTaskById(taskId);
  },
  
  // For backward compatibility
  removeTask: (taskId: string): boolean => {
    return activeTasksStorage.removeTask(taskId);
  },
  
  // For testing
  ACTIVE_TASKS_KEY: constants.ACTIVE_TASKS_KEY,
  COMPLETED_TASKS_KEY: constants.COMPLETED_TASKS_KEY,
};

// Re-export constants for testing
export const { ACTIVE_TASKS_KEY, COMPLETED_TASKS_KEY } = constants;
