
import { activeTasksStorage } from './activeTasksStorage';
import { completedTasksStorage } from './completedTasksStorage';
import { taskRelationshipStorage } from './taskRelationshipStorage';
import { constants } from './constants';
import { migrateTaskTypes } from './taskMigration';

// Export all storage modules with a unified interface
export const taskStorage = {
  ...activeTasksStorage,
  ...completedTasksStorage,
  ...taskRelationshipStorage,
  migrateTaskTypes, // Export the migration utility
  // For testing
  ACTIVE_TASKS_KEY: constants.ACTIVE_TASKS_KEY,
  COMPLETED_TASKS_KEY: constants.COMPLETED_TASKS_KEY,
};

// Re-export constants for testing
export const { ACTIVE_TASKS_KEY, COMPLETED_TASKS_KEY } = constants;
