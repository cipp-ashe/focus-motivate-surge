
// Core task hooks
export { useTaskEvents } from './useTaskEvents';
export { useTasksInitializer } from './useTasksInitializer';
export { useTasksNavigation } from './useTasksNavigation';
export { useTemplateTasksManager } from './useTemplateTasksManager';

// Habit task scheduler and related hooks
export { useHabitTaskScheduler } from './useHabitTaskScheduler';
export { 
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator 
} from './habitTasks';

// Re-export task verification utilities
export { taskVerification } from '@/lib/verification/taskVerification';
export { taskStorage } from '@/lib/storage/taskStorage';
