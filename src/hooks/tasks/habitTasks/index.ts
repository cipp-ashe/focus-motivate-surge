
// Export all habit task related hooks
export { useHabitTaskCleanup } from './useHabitTaskCleanup';
export { useHabitTaskProcessor } from './useHabitTaskProcessor';
export { useHabitTaskChecker } from './useHabitTaskChecker';
export { useHabitTaskTracker } from './useHabitTaskTracker';
export { useTaskVerification as taskVerification } from './useTaskVerification';

// Re-export from lib/storage for convenience
import { taskStorage } from '@/lib/storage/taskStorage';
export { taskStorage };

// Export the main creator
export { useHabitTaskCreator } from './useHabitTaskCreator';
