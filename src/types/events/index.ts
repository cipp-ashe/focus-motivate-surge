
/**
 * Event Types Module
 * 
 * This module exports all event-related types from a single location.
 */

// Export all types from the unified events file
export * from './unified';

// Re-export original habit event types for backward compatibility
export * from './habit-events';

// For backward compatibility, export these types from the unified module
import { EventType, EventPayload, EventCallback, EventPayloadMap } from './unified';
export { EventType, EventPayload, EventCallback, EventPayloadMap };
