
/**
 * Event system unified exports
 * This file maintains backward compatibility while organizing events into domains
 */

// Import from base module
import { EventUnsubscribe, BaseEventCallback } from './base';

// Import from domain-specific modules
import { TaskEventType, TaskEventPayloadMap } from './task-events';
import { HabitEventType, HabitEventPayloadMap, HabitTaskEvent, HabitNoteData } from './habit-events';
import { NoteEventType, NoteEventPayloadMap } from './note-events';
import { TimerEventType, TimerEventPayloadMap } from './timer-events';
import { 
  VoiceNoteEventType, VoiceNoteEventPayloadMap,
  JournalEventType, JournalEventPayloadMap,
  RelationshipEventType, RelationshipEventPayloadMap,
  AppEventType, AppEventPayloadMap,
  WildcardEventType, WildcardEventPayloadMap
} from './misc-events';

// Define all possible event types in the application
export type EventType =
  | TaskEventType
  | HabitEventType
  | NoteEventType
  | TimerEventType
  | VoiceNoteEventType
  | JournalEventType
  | RelationshipEventType
  | AppEventType
  | WildcardEventType;

// Export this as a type for backward compatibility
export type AllEventTypes = EventType;

// Define the base payload interface for events by merging all domain payloads
export interface EventPayloadMap extends
  TaskEventPayloadMap,
  HabitEventPayloadMap,
  NoteEventPayloadMap,
  TimerEventPayloadMap,
  VoiceNoteEventPayloadMap,
  JournalEventPayloadMap,
  RelationshipEventPayloadMap,
  AppEventPayloadMap,
  WildcardEventPayloadMap {}

// Generic type to get the appropriate payload for a given event type
export type EventPayload<E extends EventType> = EventPayloadMap[E];

// Type for all event callbacks
export type EventCallback<E extends EventType> = (payload: EventPayloadMap[E]) => void;

// Re-export domain-specific types for convenience - using 'export type' syntax for isolatedModules compatibility
export type { EventUnsubscribe };
export type { HabitTaskEvent };
export type { HabitNoteData };
export type { VoiceNoteEventType };

