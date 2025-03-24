
/**
 * Unified Event Types
 * Single source of truth for all event-related types
 */

// Re-export event types from their respective files
export type { BaseEventCallback, EventHandler, EventDispatcher, EventUnsubscribe } from './events/base';
export type { EventType, EventPayload, EventCallback, TimerEventType, CoreEventType, HabitEventType, HabitTaskEvent, HabitEventPayloadMap } from './events/unified';
export type { HabitCompletionEvent, TemplateUpdateEvent } from './events/habit-events';

// For backward compatibility, re-export the types directly
export * from './events/base';
export * from './events/unified';
export * from './events/habit-events';
