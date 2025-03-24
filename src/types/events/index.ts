
/**
 * Event Types Module
 * 
 * This module exports all event-related types from a single location.
 */

// Export all types from the unified events file
export * from './unified';

// Export base event types
export * from './base';

// Export habit specific event types
export * from './habit-events';

// Additional types that might be used in various places
export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  habitId?: string;
  templateId?: string;
  taskId?: string;
}
