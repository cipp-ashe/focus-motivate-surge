
// Core hooks for application-wide use
export { useEvent } from './useEvent';
export { useLocalStorage } from './useLocalStorage';
export { useToast } from './use-toast';
export { useIsMobile } from './ui/useIsMobile';

// Feature-specific hooks
export { useHabits } from './habits/useHabits';
export { useHabitEvents } from './habits/useHabitEvents';
export { useHabitCompletion } from './habits/useHabitCompletion';
export { useHabitProgress } from './habits/useHabitProgress';
export { useHabitRelationships } from './habits/useHabitRelationships';
export { useTemplateCreation } from './habits/useTemplateCreation';
export { useTemplateManagement } from './habits/useTemplateManagement';
export { useTodaysHabits } from './habits/useTodaysHabits';
export { useUnifiedHabitEvents } from './habits/useUnifiedHabitEvents';

// Task-related hooks
export { useTasks } from './useTasks';
export { useUnifiedTaskManager } from './tasks/useUnifiedTaskManager';
export { useTaskManager } from './tasks/useTaskManager';
export { useTaskActions } from './tasks/useTaskActions';
export { useTaskEvents } from './tasks/useTaskEvents';
export { useTaskManagement } from './tasks/useTaskManagement';

// Journal-related hooks
export { useJournalService } from './journal/useJournalService';

// Habit task integration hooks
export { useHabitTaskProcessor } from './tasks/habitTasks/useHabitTaskProcessor';
export { useHabitTaskChecker } from './tasks/habitTasks/useHabitTaskChecker';
export { useHabitTaskCleanup } from './tasks/habitTasks/useHabitTaskCleanup';
