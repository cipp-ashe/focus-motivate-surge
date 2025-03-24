
// Core utility hooks
export { useEvent } from './useEvent';
export { useLocalStorage } from './useLocalStorage';
export { useToast } from './use-toast';
export { useIsMobile } from './ui/useIsMobile';

// Re-export from habit hooks
export {
  useHabits,
  useHabitEvents,
  useHabitCompletion,
  useHabitProgress, 
  useHabitRelationships,
  useTemplateCreation,
  useTemplateManagement,
  useTodaysHabits,
  useHabitTaskIntegration
} from './habits';

// Task hooks
export { useTasks } from './useTasks';
export { useUnifiedTaskManager } from './tasks/useUnifiedTaskManager';
export { useTaskManager } from './tasks/useTaskManager';
export { useTaskActions } from './tasks/useTaskActions';
export { useTaskEvents } from './tasks/useTaskEvents';
export { useTaskManagement } from './tasks/useTaskManagement';

// Journal hooks
export { useJournalService } from './journal/useJournalService';

// Habit-task integration 
export { useHabitTaskProcessor } from './tasks/habitTasks/useHabitTaskProcessor';

// These hooks need to be imported directly to avoid circular dependencies
export { useHabitTaskChecker } from './tasks/habitTasks/useHabitTaskChecker';
export { useHabitTaskCleanup } from './tasks/habitTasks/useHabitTaskCleanup';
