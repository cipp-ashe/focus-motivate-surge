
// Various miscellaneous event types for the application

// Voice Note Events
export type VoiceNoteEventType = 
  | 'voice-note:add'
  | 'voice-note:delete'
  | 'voice-note:update'
  | 'voice-note:transcript';

export interface VoiceNoteEventPayloadMap {
  'voice-note:add': {
    id: string;
    audioUrl: string;
    text?: string;
    duration: number;
    createdAt: string;
  };
  'voice-note:delete': {
    id: string;
  };
  'voice-note:update': {
    id: string;
    updates: Partial<any>;
  };
  'voice-note:transcript': {
    id: string;
    text: string;
  };
}

// Journal Events
export type JournalEventType = 
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:open';

export interface JournalEventPayloadMap {
  'journal:create': {
    title: string;
    content: string;
    tags?: string[];
  };
  'journal:update': {
    id: string;
    updates: any;
  };
  'journal:delete': {
    id: string;
  };
  'journal:open': {
    id: string;
    title: string;
    content: string;
    type: string;
  };
}

// Relationship Events
export type RelationshipEventType = 
  | 'relationship:create'
  | 'relationship:update'
  | 'relationship:delete';

export interface RelationshipEventPayloadMap {
  'relationship:create': {
    name: string;
    type: string;
  };
  'relationship:update': {
    id: string;
    updates: any;
  };
  'relationship:delete': {
    id: string;
  };
}

// App-level Events
export type AppEventType = 
  | 'app:initialized'
  | 'app:error'
  | 'app:settings-changed';

export interface AppEventPayloadMap {
  'app:initialized': {
    timestamp: string;
  };
  'app:error': {
    message: string;
    stack?: string;
  };
  'app:settings-changed': {
    key: string;
    value: any;
  };
}

// Wildcard Events (for special handlers)
export type WildcardEventType = '*';

export interface WildcardEventPayloadMap {
  '*': any;
}
