
/**
 * Miscellaneous event types grouped together
 */

// VoiceNote event types
export type VoiceNoteEventType =
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete'
  | 'voicenote:record'
  | 'voicenote:stop'
  | 'voicenote:playback';

// Journal event types
export type JournalEventType =
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:open'
  | 'journal:save'
  | 'journal:template'
  | 'journal:prompt';

// Relationship event types
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:update'
  | 'relationship:delete';

// App-level event types
export type AppEventType =
  | 'app:init'
  | 'app:ready'
  | 'app:error'
  | 'app:theme-change'
  | 'app:route-change'
  | 'app:notification'
  | 'app:user-settings'
  | 'app:logout'
  | 'app:login';

// Wildcard event type for listening to all events
export type WildcardEventType = '*';

// Event payload maps
export interface VoiceNoteEventPayloadMap {
  'voicenote:create': { id: string; taskId?: string; duration: number };
  'voicenote:update': { id: string; updates: any };
  'voicenote:delete': { id: string };
  'voicenote:record': { id: string; taskId?: string };
  'voicenote:stop': { id: string; duration: number; url: string };
  'voicenote:playback': { id: string; action: 'play' | 'pause' | 'stop' };
}

export interface JournalEventPayloadMap {
  'journal:create': { id: string; title: string; content?: string; tags?: string[] };
  'journal:update': { id: string; updates: any };
  'journal:delete': { id: string };
  'journal:open': { habitId?: string; habitName?: string; description?: string; templateId?: string };
  'journal:save': { id: string; content: string };
  'journal:template': { templateId: string; content: string };
  'journal:prompt': { prompt: string };
}

export interface RelationshipEventPayloadMap {
  'relationship:create': { type: string; sourceId: string; targetId: string; metadata?: any };
  'relationship:update': { type: string; sourceId: string; targetId: string; updates: any };
  'relationship:delete': { type: string; sourceId: string; targetId: string };
}

export interface AppEventPayloadMap {
  'app:init': undefined;
  'app:ready': undefined;
  'app:error': { message: string; code?: string; details?: any };
  'app:theme-change': { theme: 'light' | 'dark' | 'system' };
  'app:route-change': { path: string; previousPath?: string };
  'app:notification': { message: string; type?: 'info' | 'success' | 'warning' | 'error' };
  'app:user-settings': { settings: any };
  'app:logout': undefined;
  'app:login': { userId: string };
}

export interface WildcardEventPayloadMap {
  '*': { eventType: string; payload: any; timestamp: string };
}
