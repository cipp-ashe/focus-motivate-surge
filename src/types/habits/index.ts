
/**
 * Habit Types Module
 * 
 * This is the main entry point for habit-related types. It re-exports
 * everything from the unified type system.
 */

export * from './unified';

// Legacy type alias for backward compatibility during transition
export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'rating';
