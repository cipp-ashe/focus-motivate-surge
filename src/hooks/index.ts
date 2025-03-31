
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

// Export panel hooks from their source
export { usePanel, useNotesPanel, useHabitsPanel } from '@/contexts/ui/PanelContext';

// Task hooks (consolidated to reduce duplication)
export { useTaskEvents, useTasks } from './tasks/useTaskEvents';
export { useUnifiedTaskManager, useTaskManager } from './tasks/useUnifiedTaskManager';

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

// Journal hooks
export { useJournalService } from './journal/useJournalService';

// Habit-task integration hooks
export {
  useHabitTaskProcessor,
  useHabitTaskChecker,
  useHabitTaskCleanup
} from './tasks/habitTasks';

// Timer hooks
export { useTimer } from './timer/useTimer';
