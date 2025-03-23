
// Re-export for compatibility
export type { 
  EventType,
  EventPayload,
  EventCallback,
  EventPayloadMap,
  TaskEventType,
  HabitEventType,
  TimerEventType,
  UIEventType,
  SystemEventType,
  NoteEventType,
  VoiceNoteEventType,
  RelationshipEventType,
  JournalEventType,
  EventUnsubscribe
} from './events/index';

// Legacy type aliases for backward compatibility
export type { EventType as AllEventTypes } from './events/index';
export type { EventCallback as EventHandler } from './events/index';
