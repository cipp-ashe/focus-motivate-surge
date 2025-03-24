
/**
 * Habit Hooks Barrel File
 * 
 * This file exports all habit-related hooks from a central location,
 * making imports cleaner throughout the application.
 */

// Core habit hooks
export { useHabits } from './useHabits';
export { useHabitEvents } from './useHabitEvents';
export { useHabitTaskIntegration } from './useHabitTaskIntegration';

// Template management
export { useTodaysHabits } from './useTodaysHabits';
export { useHabitCompletion } from './useHabitCompletion';

// These will eventually be consolidated, but kept for now for backward compatibility
export { useHabitProgress } from './useHabitProgress';
export { useHabitRelationships } from './useHabitRelationships';
export { useTemplateCreation } from './useTemplateCreation';
export { useTemplateManagement } from './useTemplateManagement';
