// Event types for all application events
export type AppEventType = 
  | "app:start" 
  | "app:error" 
  | "app:theme-change" 
  | "app:language-change"
  | "app:initialized";

export type AuthEventType = 
  | "auth:login" 
  | "auth:logout" 
  | "auth:register" 
  | "auth:password-reset";

export type HabitEventType = 
  | "habits:create" 
  | "habits:update" 
  | "habits:delete" 
  | "habits:complete" 
  | "habits:check-pending"
  | "habit:template-add"
  | "habit:template-update"
  | "habit:template-delete"
  | "habit:schedule"
  | "habit:complete"
  | "habit:dismissed"
  | "habit:select"
  | "habit:task-deleted"
  | "habit:journal-deleted";

export type NavigationEventType = 
  | "navigation:change" 
  | "navigation:go-back" 
  | "navigation:go-forward";

export type NoteEventType = 
  | "note:create" 
  | "note:update" 
  | "note:delete" 
  | "note:create-from-habit"
  | "note:view"
  | "note:deleted"
  | "note:format"
  | "note:format-complete";

export type QuoteEventType = 
  | "quote:create" 
  | "quote:update" 
  | "quote:delete" 
  | "quote:favorite" 
  | "quote:unfavorite"
  | "quote:link-task";

export type RelationshipEventType = 
  | "relationship:create" 
  | "relationship:update" 
  | "relationship:delete"
  | "relationship:batch-update";

export type TagEventType = 
  | "tag:create" 
  | "tag:update" 
  | "tag:delete" 
  | "tag:assign" 
  | "tag:remove"
  | "tag:link"
  | "tag:unlink"
  | "tags:force-update";

export type TaskEventType = 
  | "task:create" 
  | "task:update" 
  | "task:delete" 
  | "task:complete" 
  | "task:dismiss" 
  | "task:reload"
  | "task:select";

export type TimerEventType = 
  | "timer:start" 
  | "timer:pause" 
  | "timer:resume" 
  | "timer:stop" 
  | "timer:complete" 
  | "timer:extend" 
  | "timer:reset" 
  | "timer:tick" 
  | "timer:set-task" 
  | "timer:task-set" 
  | "timer:init"
  | "timer:expand"
  | "timer:collapse"
  | "timer:close"
  | "timer:metrics-update"
  | "timer:initialized"
  | "timer:request-sync";

export type JournalEventType = 
  | "journal:create" 
  | "journal:update" 
  | "journal:delete"
  | "journal:open";

export type VoiceNoteEventType = 
  | "voicenote:start" 
  | "voicenote:stop" 
  | "voicenote:transcribe" 
  | "voicenote:save";

// Combined event type for all possible events
export type AllEventTypes = 
  | AppEventType 
  | AuthEventType 
  | HabitEventType 
  | NavigationEventType 
  | NoteEventType 
  | QuoteEventType 
  | RelationshipEventType 
  | TagEventType 
  | TaskEventType 
  | TimerEventType 
  | JournalEventType 
  | VoiceNoteEventType;

// Payloads for each event type
export interface EventPayloads {
  // App events
  "app:start": {};
  "app:error": { message: string; code?: string; };
  "app:theme-change": { theme: string; };
  "app:language-change": { language: string; };
  "app:initialized": { timestamp: string; };

  // Auth events
  "auth:login": { userId: string; email?: string; };
  "auth:logout": {};
  "auth:register": { userId: string; email?: string; };
  "auth:password-reset": { email: string; };

  // Habit events
  "habits:create": { habitId: string; name: string; };
  "habits:update": { habitId: string; updates: any; };
  "habits:delete": { habitId: string; };
  "habits:complete": { habitId: string; date: string; };
  "habits:check-pending": {};
  "habit:template-add": { id: string; templateId: string; };
  "habit:template-update": { templateId: string; [key: string]: any; };
  "habit:template-delete": { templateId: string; isOriginatingAction?: boolean; };
  "habit:schedule": { habitId: string; templateId: string; name: string; duration: number; date: string; };
  "habit:complete": { habitId: string; date: string; };
  "habit:dismissed": { habitId: string; date: string; };
  "habit:select": { habitId: string; };
  "habit:task-deleted": { habitId: string; taskId: string; date: string; };
  "habit:journal-deleted": { habitId: string; date: string; };

  // Navigation events
  "navigation:change": { path: string; };
  "navigation:go-back": {};
  "navigation:go-forward": {};

  // Note events
  "note:create": { id: string; title: string; content: string; };
  "note:update": { id: string; updates: any; };
  "note:delete": { id: string; };
  "note:create-from-habit": { habitId: string; habitName: string; content: string; templateId?: string; };
  "note:view": { id: string; };
  "note:deleted": { id: string; };
  "note:format": { contentType: string; };
  "note:format-complete": { formattedContent: string; };

  // Quote events
  "quote:create": { id: string; text: string; author?: string; };
  "quote:update": { id: string; updates: any; };
  "quote:delete": { id: string; };
  "quote:favorite": { id: string; };
  "quote:unfavorite": { id: string; };
  "quote:link-task": { quoteId: string; taskId: string; };

  // Relationship events
  "relationship:create": { id: string; type: string; sourceId: string; targetId: string; };
  "relationship:update": { id: string; updates: any; };
  "relationship:delete": { id: string; };
  "relationship:batch-update": { updates: any[] };

  // Tag events
  "tag:create": { id: string; name: string; color?: string; };
  "tag:update": { id: string; updates: any; };
  "tag:delete": { id: string; };
  "tag:assign": { tagId: string; itemId: string; itemType: string; };
  "tag:remove": { tagId: string; itemId: string; };
  "tag:link": { tagId: string; entityId: string; entityType: string; };
  "tag:unlink": { tagId: string; entityId: string; };
  "tags:force-update": {};

  // Task events
  "task:create": { id: string; name: string; description?: string; taskType?: string; [key: string]: any; };
  "task:update": { taskId: string; updates: any; };
  "task:delete": { taskId: string; reason?: string; };
  "task:complete": { taskId: string; metrics?: any; };
  "task:dismiss": { taskId: string; habitId?: string; date?: string; };
  "task:reload": {};
  "task:select": string;

  // Timer events
  "timer:start": { taskId?: string; taskName?: string; duration?: number; };
  "timer:pause": { taskName: string; timeLeft: number; pauseCount?: number; };
  "timer:resume": { taskName: string; timeLeft?: number; };
  "timer:stop": {};
  "timer:complete": { taskName: string; metrics: any; taskId?: string; };
  "timer:extend": { minutes: number; };
  "timer:reset": { taskName: string; duration: number; };
  "timer:tick": { timeLeft: number; taskName?: string; remaining?: number; };
  "timer:set-task": { id: string; name: string; duration?: number; taskId?: string; };
  "timer:task-set": { id: string; name: string; duration?: number; taskId?: string; };
  "timer:init": { taskName: string; duration: number; taskId?: string; };
  "timer:expand": { taskName: string; };
  "timer:collapse": { taskName: string; saveNotes?: boolean; };
  "timer:close": { taskName: string; };
  "timer:metrics-update": { taskName: string; metrics: any; };
  "timer:initialized": { taskName: string; timestamp: string; };
  "timer:request-sync": { taskName: string; timestamp: string; };

  // Journal events
  "journal:create": { id: string; title: string; content: string; date: string; };
  "journal:update": { id: string; updates: any; };
  "journal:delete": { id: string; };
  "journal:open": { id: string; title?: string; };

  // Voice note events
  "voicenote:start": { taskId?: string; };
  "voicenote:stop": {};
  "voicenote:transcribe": { audioUrl: string; };
  "voicenote:save": { taskId: string; text: string; url: string; duration: number; };
}
