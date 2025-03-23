
// A unified events type file to simplify imports and resolve conflicts
import { Task } from '@/types/tasks';
import { ActiveTemplate, HabitTemplate } from '@/components/habits/types';

/**
 * @deprecated This type is maintained for backward compatibility.
 * Use specific event types and payloads instead.
 */
export type AllEventTypes = string;

/**
 * @deprecated Use EventCallback<T> from the EventManager instead
 */
export type EventHandler<T = any> = (payload: T) => void;

// Re-export task types to avoid circular dependencies
// Define all event names as string literal types
export type TaskEventType = 
  | 'task:create' 
  | 'task:update' 
  | 'task:delete' 
  | 'task:complete'
  | 'task:select'
  | 'task:force-update';

export type HabitEventType = 
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:verify-tasks'
  | 'habit:check-pending'
  | 'habit:schedule'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:dismissed'
  | 'habit:tasks-sync'
  | 'habit:progress-update'
  | 'habits:verify-tasks'
  | 'habit:template-order-update'
  | 'habit:select';

export type NoteEventType =
  | 'note:create'
  | 'note:update'
  | 'note:deleted' 
  | 'note:view'
  | 'note:format'
  | 'note:format-complete'
  | 'note:create-from-habit'
  | 'note:create-from-voice';

export type VoiceNoteEventType =
  | 'voice-note:created'
  | 'voice-note:deleted';

export type TimerEventType = 
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:tick'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  | 'timer:set-task'
  | 'timer:metrics-update'
  | 'timer:close';

export type UIEventType =
  | 'ui:theme-change'
  | 'ui:sidebar-toggle'
  | 'ui:modal-open'
  | 'ui:modal-close'
  | 'ui:note-panel-toggle';

export type SystemEventType =
  | 'system:sync-start'
  | 'system:sync-complete'
  | 'system:error'
  | 'system:auth-change'
  | 'app:initialized'
  | '*'; // Wildcard for listening to all events

export type RelationshipEventType =
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task';

// Union of all event types
export type EventType = 
  | TaskEventType 
  | HabitEventType 
  | TimerEventType 
  | UIEventType 
  | SystemEventType
  | NoteEventType
  | VoiceNoteEventType
  | RelationshipEventType;

// Define payload type for each event
export interface EventPayloadMap {
  // Task events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string | null;
  'task:force-update': undefined;
  
  // Habit events
  'habit:template-add': { templateId: string };
  'habit:template-update': ActiveTemplate;
  'habit:template-delete': { templateId: string };
  'habit:verify-tasks': {};
  'habit:check-pending': {};
  'habit:schedule': { 
    habitId: string; 
    name: string; 
    duration: number; 
    templateId: string;
    date: string;
  };
  'habit:journal-complete': { habitId: string; templateId: string };
  'habit:journal-deleted': { habitId: string; templateId: string };
  'habit:dismissed': { habitId: string; date: string };
  'habit:tasks-sync': any;
  'habit:progress-update': any;
  'habits:verify-tasks': any;
  'habit:template-order-update': any;
  'habit:select': any;
  
  // Note events
  'note:create': any;
  'note:update': any;
  'note:deleted': any;
  'note:view': any;
  'note:format': any;
  'note:format-complete': any;
  'note:create-from-habit': any;
  'note:create-from-voice': any;
  
  // Voice Note events
  'voice-note:created': any;
  'voice-note:deleted': any;
  
  // Timer events
  'timer:start': { 
    taskId?: string; 
    taskName: string; 
    duration: number;
    currentTime?: number;
  };
  'timer:pause': { 
    taskId?: string; 
    taskName: string; 
    timeLeft: number;
  };
  'timer:resume': { 
    taskId?: string; 
    taskName: string; 
    timeLeft: number;
  };
  'timer:reset': { 
    taskId?: string; 
    taskName: string; 
    duration?: number;
  };
  'timer:complete': { 
    taskId?: string; 
    taskName?: string; 
    metrics?: any;
  };
  'timer:tick': { 
    taskName?: string; 
    timeLeft?: number; 
    remaining?: number;
  };
  'timer:expand': { 
    taskName: string;
  };
  'timer:collapse': { 
    taskName: string; 
    saveNotes: boolean;
  };
  'timer:update-metrics': { 
    taskId: string; 
    metrics: any; 
    taskName?: string;
  };
  'timer:set-task': {
    id: string;
    name: string;
    duration: number;
    completed?: boolean;
    createdAt?: string;
    tags?: any[];
  };
  'timer:metrics-update': {
    taskName: string;
    metrics: any;
  };
  'timer:close': {
    taskName: string;
  };
  
  // UI events
  'ui:theme-change': { theme: 'light' | 'dark' | 'system' };
  'ui:sidebar-toggle': boolean;
  'ui:modal-open': { id: string; data?: any };
  'ui:modal-close': { id: string };
  'ui:note-panel-toggle': boolean;
  
  // System events
  'system:sync-start': undefined;
  'system:sync-complete': { success: boolean; error?: string };
  'system:error': { message: string; code?: string; stack?: string };
  'system:auth-change': { authenticated: boolean; userId?: string };
  'app:initialized': any;
  '*': any; // Wildcard type
  
  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  'tag:link': any;
  'tag:unlink': any;
  'quote:link-task': any;
}

// Helper type to get payload type for a specific event
export type EventPayload<T extends EventType> = T extends keyof EventPayloadMap 
  ? EventPayloadMap[T] 
  : any;

// Callback function type for event handlers
export type EventCallback<T extends EventType> = (payload: EventPayload<T>) => void;
