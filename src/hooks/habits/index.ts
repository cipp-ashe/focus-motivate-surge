
/**
 * Habit Hooks Index
 * 
 * This file exports all habit-related hooks
 */

// Core habit hooks
export { useHabits } from './useHabits';
export { useHabitEvents } from './useHabitEvents';
export { useHabitProgress } from './useHabitProgress';
export { useHabitCompletion } from './useHabitCompletion';
export { useHabitRelationships } from './useHabitRelationships';

// Template management hooks
export { useTemplateCreation } from './useTemplateCreation';
export { useTemplateManagement } from './useTemplateManagement';
export { useTodaysHabits } from './useTodaysHabits';

// Habit-task integration
export { useHabitTaskIntegration } from './useHabitTaskIntegration';

// Mutation hooks
export { useCompletionMutation } from './useCompletionMutation';
export { useDismissMutation } from './useDismissMutation';
