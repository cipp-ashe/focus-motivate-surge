
import { useHabitTaskTracker } from './useHabitTaskTracker';
import { useHabitTaskProcessor } from './useHabitTaskProcessor';
import { useHabitTaskCleanup } from './useHabitTaskCleanup';
import { useHabitTaskChecker } from './useHabitTaskChecker';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { Task } from '@/types/tasks';
import { MutableRefObject } from 'react';

// Define return type for the scheduler hook
export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: MutableRefObject<Record<string, string>>;
  checkForMissingHabitTasks: () => void;
}

/**
 * Re-export all habit task related hooks with consolidated interface
 */
export {
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator
};

// Define the unified interface for task verification
export interface TaskVerificationResult {
  missingTasks: Task[];
  duplicateTasks: Task[];
  inconsistentTasks: Task[];
}

// Export a unified verification interface
export { taskVerification } from '@/lib/verification/taskVerification';
export { taskStorage } from '@/lib/storage/taskStorage';
