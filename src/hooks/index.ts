
/**
 * Hooks Index
 * 
 * This file re-exports all hooks from various modules for a cleaner import pattern
 */

// Core utility hooks
export { useEvent } from './useEvent';
export { useLocalStorage } from './useLocalStorage';
export { useToast } from './use-toast';
export { useIsMobile } from './ui/useIsMobile';
export { useUserPreferences } from './useUserPreferences';

// Re-export habit hooks
export {
  useHabits,
  useHabitEvents,
  useHabitCompletion,
  useHabitProgress, 
  useHabitRelationships,
  useTemplateCreation,
  useTemplateManagement,
  useTodaysHabits,
  useHabitTaskIntegration,
  useCompletionMutation,
  useDismissMutation
} from './habits';

// Task hooks
export { useTasks } from './useTasks';
export { useUnifiedTaskManager } from './tasks/useUnifiedTaskManager';
export { useTaskManager } from './tasks/useTaskManager';
export { useTaskActions } from './tasks/useTaskActions';
export { useTaskEvents } from './tasks/useTaskEvents';
export { useTaskManagement } from './tasks/useTaskManagement';
export { useTaskCreation } from './tasks/useTaskCreation';

// Journal hooks
export { useJournalService } from './journal/useJournalService';

// Habit-task integration hooks
export {
  useHabitTaskProcessor,
  useHabitTaskChecker,
  useHabitTaskCleanup
} from './tasks/habitTasks';
