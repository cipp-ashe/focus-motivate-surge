
/**
 * Miscellaneous event types and payloads
 */

// Voice note event type definitions
export type VoiceNoteEventType =
  | 'voice-note:created'
  | 'voice-note:deleted';

// Journal event type definitions
export type JournalEventType = 'journal:open';

// Relationship event type definitions
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task';

// App event type definitions
export type AppEventType = 'app:initialized';

// Special wildcard event type
export type WildcardEventType = '*';

// Payload definitions for voice note events
export interface VoiceNoteEventPayloadMap {
  'voice-note:created': { id: string; name: string; url: string; duration: number };
  'voice-note:deleted': { id: string };
}

// Payload definitions for journal events
export interface JournalEventPayloadMap {
  'journal:open': { habitId: string; habitName: string };
}

// Payload definitions for relationship events
export interface RelationshipEventPayloadMap {
  'relationship:create': { entityId: string; entityType: string; relatedEntityId: string; relatedEntityType: string };
  'relationship:delete': { entityId: string; entityType: string; relatedEntityId: string; relatedEntityType: string };
  'relationship:update': { entityId: string; entityType: string; updates: any };
  'relationship:batch-update': { entityId: string; entityType: string; relationships: any[] };
  'tag:link': { tagId: string; entityId: string; entityType: string };
  'tag:unlink': { tagId: string; entityId: string; entityType: string };
  'quote:link-task': { quoteId: string; taskId: string };
}

// Payload definitions for app events
export interface AppEventPayloadMap {
  'app:initialized': { timestamp: string };
}

// Payload definition for wildcard events
export interface WildcardEventPayloadMap {
  '*': any;
}
