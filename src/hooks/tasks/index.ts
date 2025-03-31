
/**
 * Task Hooks Index
 * 
 * This module exports all task-related hooks for easier imports.
 * Each hook is dedicated to a specific concern following the Single Responsibility Principle.
 */

// Primary task hooks
export { useTaskEvents, useTasks } from './useTaskEvents';
export { useTaskManager, useUnifiedTaskManager } from './useUnifiedTaskManager';

// Task initialization and management
export { useTasksInitializer } from './useTasksInitializer';
export { useTasksNavigation } from './useTasksNavigation';
export { useTemplateTasksManager } from './useTemplateTasksManager';
export { useTimerTasksManager } from './useTimerTasksManager';

// Habit task integration
export { useHabitTaskScheduler } from './useHabitTaskScheduler';
export { 
  useHabitTaskTracker,
  useHabitTaskProcessor,
  useHabitTaskCleanup,
  useHabitTaskChecker,
  useHabitTaskCreator
} from './habitTasks';

// Re-export utility functions from task-related modules
export { taskStorage } from '@/lib/storage/task';
export { taskVerification } from '@/lib/verification/taskVerification';
