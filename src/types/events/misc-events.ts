
/**
 * Miscellaneous event types that don't fit in other categories
 */

// Voice note related events
export type VoiceNoteEventType = 
  | 'voice-note:start-recording'
  | 'voice-note:stop-recording'
  | 'voice-note:save'
  | 'voice-note:play'
  | 'voice-note:delete';

export interface VoiceNoteEventPayloadMap {
  'voice-note:start-recording': {
    taskId?: string;
    reference?: string;
  };
  'voice-note:stop-recording': {
    taskId?: string;
  };
  'voice-note:save': {
    taskId: string;
    taskName: string;
    audioUrl: string;
    duration: number;
  };
  'voice-note:play': {
    audioUrl: string;
  };
  'voice-note:delete': {
    taskId: string;
    audioUrl: string;
  };
}

// Relationship related events
export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:update'
  | 'relationship:delete';

export interface RelationshipEventPayloadMap {
  'relationship:create': {
    sourceType: string;
    sourceId: string;
    targetType: string;
    targetId: string;
    relationshipType: string;
  };
  'relationship:update': {
    id: string;
    updates: any;
  };
  'relationship:delete': {
    id: string;
  };
}

// App-wide events
export type AppEventType =
  | 'app:initialized'
  | 'app:theme-change'
  | 'app:user-login'
  | 'app:user-logout'
  | 'app:error'
  | 'app:notification';

export interface AppEventPayloadMap {
  'app:initialized': undefined;
  'app:theme-change': {
    theme: 'light' | 'dark' | 'system';
  };
  'app:user-login': {
    userId: string;
    email?: string;
  };
  'app:user-logout': undefined;
  'app:error': {
    code: string;
    message: string;
    details?: any;
  };
  'app:notification': {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
  };
}

// Wildcard events (used for debugging and analytics)
export type WildcardEventType = '*';

export interface WildcardEventPayloadMap {
  '*': {
    eventType: string;
    payload: any;
    timestamp: string;
  };
}
