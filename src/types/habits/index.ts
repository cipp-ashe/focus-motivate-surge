
/**
 * Habit Types Module
 * 
 * This is the main entry point for habit-related types.
 */

export * from './unified';

// Export MetricType for backward compatibility during transition
// This type is used in many places and will be phased out gradually
export type MetricType = 'timer' | 'journal' | 'boolean' | 'counter' | 'rating';
