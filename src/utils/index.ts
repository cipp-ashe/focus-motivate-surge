
/**
 * Utils Index
 * 
 * This file exports all utility functions from a single location
 */

// Core utilities
export * from './events';

// Journal utilities
export * from './journalUtils';

// UI utilities
export { cn } from '@/lib/utils';

// Task utilities
export * from './tasks';

// Error handling utilities
export * from './errorHandler';

// Utility exports for app initialization
export * from './appInitialization';

// Note utilities 
export * from './noteUtils';

// Habit utilities
export * from './habitUtils';
export * from './habitTemplates';
export * from './habits/streakCalculator';

// Calculation utilities
export * from './calculations';
export * from './timeUtils';
export * from './format';

// Download utilities
export * from './downloadUtils';

// Add other utility exports here as they're created
