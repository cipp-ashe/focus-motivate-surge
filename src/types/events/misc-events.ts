
/**
 * Miscellaneous event types and payload definitions
 */

export type VoiceNoteEventType =
  | 'voice:start'
  | 'voice:stop'
  | 'voice:save'
  | 'voice:discard';

export interface VoiceNoteEventPayloadMap {
  'voice:start': { 
    taskId?: string;
    habitId?: string;
  };
  'voice:stop': undefined;
  'voice:save': { 
    url: string; 
    duration: number; 
    taskId?: string;
    habitId?: string;
  };
  'voice:discard': undefined;
}

export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete';

export interface RelationshipEventPayloadMap {
  'relationship:create': {
    sourceId: string;
    sourceType: string;
    targetId: string;
    targetType: string;
    metadata?: Record<string, any>;
  };
  'relationship:delete': {
    sourceId: string;
    targetId: string;
  };
}

export type AppEventType =
  | 'app:init'
  | 'app:ready'
  | 'app:sync'
  | 'app:error';

export interface AppEventPayloadMap {
  'app:init': undefined;
  'app:ready': undefined;
  'app:sync': { status: 'start' | 'complete' | 'error' };
  'app:error': { message: string; code?: string; details?: any };
}

export type WildcardEventType = '*';

export interface WildcardEventPayloadMap {
  '*': {
    eventType: string;
    payload: any;
    timestamp: string;
  };
}
