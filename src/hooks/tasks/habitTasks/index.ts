
import { useHabitTaskTracker } from './useHabitTaskTracker';
import { useHabitTaskProcessor } from './useHabitTaskProcessor';
import { useHabitTaskCleanup } from './useHabitTaskCleanup';
import { useHabitTaskChecker } from './useHabitTaskChecker';
import { useHabitTaskCreator } from './useHabitTaskCreator';

// Define return type for the scheduler hook
export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: React.MutableRefObject<Record<string, any>>;
  checkForMissingHabitTasks: () => void;
}

export {
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator
};
