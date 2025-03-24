
/**
 * Habit Hooks Barrel File
 * 
 * This file exports all habit-related hooks from a central location,
 * making imports cleaner throughout the application.
 */

// Export hooks from their source files
export { useHabits } from './useHabits';
export { useHabitEvents } from './useHabitEvents';
export { useHabitTaskIntegration } from './useHabitTaskIntegration';
export { useTodaysHabits } from './useTodaysHabits';
export { useHabitCompletion } from './useHabitCompletion';

// Legacy exports kept for backward compatibility
export { useHabitProgress } from './useHabitProgress';
export { useHabitRelationships } from './useHabitRelationships';
export { useTemplateCreation } from './useTemplateCreation';
export { useTemplateManagement } from './useTemplateManagement';
