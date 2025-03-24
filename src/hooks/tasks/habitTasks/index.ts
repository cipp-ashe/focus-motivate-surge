
// Export the consolidated habit task processor
export { useHabitTaskProcessor } from './useHabitTaskProcessor';

// Re-export task operations from lib for convenience
import { habitTaskOperations } from '@/lib/operations/tasks/habit';
export { habitTaskOperations };

// Export any remaining unique hooks
export { useHabitTaskCleanup } from './useHabitTaskCleanup';
export { useHabitTaskChecker } from './useHabitTaskChecker';
export { useHabitTaskTracker } from './useHabitTaskTracker';
