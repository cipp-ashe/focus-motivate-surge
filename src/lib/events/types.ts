
// Import and re-export all event types from the main events.ts
import type { 
  AllEventTypes, 
  EventPayloads, 
  TimerEventType,
  TaskEventType,
  HabitEventType,
  RelationshipEventType,
  AppEventType,
  NavigationEventType,
  AuthEventType,
  NoteEventType,
  TagEventType,
  JournalEventType,
  QuoteEventType,
  VoiceNoteEventType
} from '@/types/events';

// Define the event handler type
export interface EventHandler<T extends AllEventTypes> {
  (payload: EventPayloads[T]): void;
}

// Re-export all event types for convenience
export type { 
  AllEventTypes, 
  EventPayloads,
  TimerEventType,
  TaskEventType,
  HabitEventType,
  RelationshipEventType,
  AppEventType,
  NavigationEventType,
  AuthEventType,
  NoteEventType,
  TagEventType,
  JournalEventType,
  QuoteEventType,
  VoiceNoteEventType
};

// Alias for EventType
export type EventType = AllEventTypes;
