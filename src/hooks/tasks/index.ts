
// Core task hooks - using our unified approach
export { useTaskEvents } from './useTaskEvents';
export { useTasksInitializer } from './useTasksInitializer';
export { useTasksNavigation } from './useTasksNavigation';
export { useTemplateTasksManager } from './useTemplateTasksManager';
export { useUnifiedTaskManager } from './useUnifiedTaskManager';

// Habit task scheduler and related hooks
export { useHabitTaskScheduler } from './useHabitTaskScheduler';
export { 
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator,
  // Re-export the task verification and storage interfaces
  taskVerification,
  taskStorage
} from './habitTasks';
