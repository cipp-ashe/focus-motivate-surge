
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

export {
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator
};
