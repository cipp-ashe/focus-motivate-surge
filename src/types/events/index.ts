
/**
 * Event Types Module
 * 
 * This is the main entry point for all event-related types.
 */

// Import all event type definitions
import { TaskEventType, TaskEventPayloadMap } from './task-events';
import { JournalEventType, JournalEventPayloadMap } from './journal-events';
import { HabitEventType, HabitEventPayloadMap } from './habit-events';
import { NoteEventType, NoteEventPayloadMap } from './note-events';
import { TimerEventType, TimerEventPayloadMap } from './timer-events';
import { VoiceNoteEventType, VoiceNoteEventPayloadMap } from './misc-events';
import { RelationshipEventType, RelationshipEventPayloadMap } from './misc-events';
import { AppEventType, AppEventPayloadMap } from './misc-events';
import { WildcardEventType, WildcardEventPayloadMap } from './misc-events';

// Union of all event types
export type EventType = 
  | TaskEventType 
  | JournalEventType 
  | HabitEventType 
  | NoteEventType
  | TimerEventType
  | VoiceNoteEventType
  | RelationshipEventType
  | AppEventType
  | WildcardEventType;

// Union of all event payload maps
export interface EventPayloadMap extends 
  TaskEventPayloadMap,
  JournalEventPayloadMap,
  HabitEventPayloadMap,
  NoteEventPayloadMap,
  TimerEventPayloadMap,
  VoiceNoteEventPayloadMap,
  RelationshipEventPayloadMap,
  AppEventPayloadMap,
  WildcardEventPayloadMap {}

// Callback type for event handlers
export type EventCallback<T extends EventType> = (payload: EventPayloadMap[T]) => void;

// Event handling interface extensions
export interface EventUnsubscribe {
  (): void;
}

export interface EventPayload<T extends EventType> {
  [key: string]: any;
}

// Export all event-specific types
export * from './task-events';
export * from './journal-events';
export * from './habit-events';
export * from './note-events';
export * from './timer-events';
export * from './misc-events';
export * from './base';
