
import { Task, TaskType } from '@/types/tasks';
import { constants } from './constants';
import { utils } from './utils';

/**
 * Migrate task types from 'regular' to 'standard' and normalize taskType/type fields
 */
export const migrateTaskTypes = (): { migratedActive: number, migratedCompleted: number } => {
  try {
    console.log('Starting task type migration...');
    
    // Migrate active tasks
    const activeTasks = utils.loadFromStorage<any[]>(constants.ACTIVE_TASKS_KEY, []);
    let activeMigrationCount = 0;
    
    const migratedActiveTasks = activeTasks.map(task => {
      const originalType = task.type || task.taskType || 'regular';
      const needsMigration = 
        originalType === 'regular' || 
        (task.type && !task.taskType) ||
        (task.taskType && !task.type) ||
        (task.type !== task.taskType);
      
      if (needsMigration) {
        activeMigrationCount++;
        const normalizedTask = utils.normalizeTask(task);
        return utils.cleanupTaskForStorage(normalizedTask);
      }
      
      return task;
    });
    
    if (activeMigrationCount > 0) {
      utils.saveToStorage(constants.ACTIVE_TASKS_KEY, migratedActiveTasks);
      console.log(`Migrated ${activeMigrationCount} active tasks`);
    }
    
    // Migrate completed tasks
    const completedTasks = utils.loadFromStorage<any[]>(constants.COMPLETED_TASKS_KEY, []);
    let completedMigrationCount = 0;
    
    const migratedCompletedTasks = completedTasks.map(task => {
      const originalType = task.type || task.taskType || 'regular';
      const needsMigration = 
        originalType === 'regular' || 
        (task.type && !task.taskType) ||
        (task.taskType && !task.type) ||
        (task.type !== task.taskType);
      
      if (needsMigration) {
        completedMigrationCount++;
        const normalizedTask = utils.normalizeTask(task);
        return utils.cleanupTaskForStorage(normalizedTask);
      }
      
      return task;
    });
    
    if (completedMigrationCount > 0) {
      utils.saveToStorage(constants.COMPLETED_TASKS_KEY, migratedCompletedTasks);
      console.log(`Migrated ${completedMigrationCount} completed tasks`);
    }
    
    return {
      migratedActive: activeMigrationCount,
      migratedCompleted: completedMigrationCount
    };
  } catch (error) {
    console.error('Error during task type migration:', error);
    return { migratedActive: 0, migratedCompleted: 0 };
  }
};
