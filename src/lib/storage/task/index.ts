
// Import necessary modules
import { activeTasksStorage } from './activeTasksStorage';
import { completedTasksStorage } from './completedTasksStorage';
import { taskRelationshipStorage } from './taskRelationshipStorage';
import { constants } from './constants';
import { migrateTaskTypes } from './taskMigration';
import { Task } from '@/types/tasks';

/**
 * Unified task storage API
 * Combines all task storage functionality into one cohesive API
 */
export const taskStorage = {
  // First include all the existing storage modules
  ...activeTasksStorage,
  ...completedTasksStorage,
  ...taskRelationshipStorage,
  
  // Add the migration utility after the modules are defined
  migrateTaskTypes,
  
  // Add a convenience method to load all tasks at once
  loadAllTasks: (): { active: Task[], completed: Task[] } => {
    const active = activeTasksStorage.loadTasks();
    const completed = completedTasksStorage.loadCompletedTasks();
    return { active, completed };
  },
  
  // For testing
  ACTIVE_TASKS_KEY: constants.ACTIVE_TASKS_KEY,
  COMPLETED_TASKS_KEY: constants.COMPLETED_TASKS_KEY,
};

// Re-export constants for testing
export const { ACTIVE_TASKS_KEY, COMPLETED_TASKS_KEY } = constants;
