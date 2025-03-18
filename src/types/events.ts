
// Event types for all application events
export type AppEventType = "app:start" | "app:error" | "app:theme-change" | "app:language-change";
export type AuthEventType = "auth:login" | "auth:logout" | "auth:register" | "auth:password-reset";
export type HabitEventType = "habits:create" | "habits:update" | "habits:delete" | "habits:complete" | "habits:check-pending";
export type NavigationEventType = "navigation:change" | "navigation:go-back" | "navigation:go-forward";
export type NoteEventType = "note:create" | "note:update" | "note:delete" | "note:create-from-habit";
export type QuoteEventType = "quote:create" | "quote:update" | "quote:delete" | "quote:favorite" | "quote:unfavorite";
export type RelationshipEventType = "relationship:create" | "relationship:update" | "relationship:delete";
export type TagEventType = "tag:create" | "tag:update" | "tag:delete" | "tag:assign" | "tag:remove";
export type TaskEventType = "task:create" | "task:update" | "task:delete" | "task:complete" | "task:dismiss" | "task:reload";
export type TimerEventType = "timer:start" | "timer:pause" | "timer:resume" | "timer:stop" | "timer:complete" | "timer:extend" | "timer:reset" | "timer:tick" | "timer:set-task" | "timer:task-set" | "timer:init";
export type JournalEventType = "journal:create" | "journal:update" | "journal:delete";
export type VoiceNoteEventType = "voicenote:start" | "voicenote:stop" | "voicenote:transcribe" | "voicenote:save";

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

  // Navigation events
  "navigation:change": { path: string; };
  "navigation:go-back": {};
  "navigation:go-forward": {};

  // Note events
  "note:create": { id: string; title: string; content: string; };
  "note:update": { id: string; updates: any; };
  "note:delete": { id: string; };
  "note:create-from-habit": { habitId: string; habitName: string; content: string; templateId?: string; };

  // Quote events
  "quote:create": { id: string; text: string; author?: string; };
  "quote:update": { id: string; updates: any; };
  "quote:delete": { id: string; };
  "quote:favorite": { id: string; };
  "quote:unfavorite": { id: string; };

  // Relationship events
  "relationship:create": { id: string; type: string; sourceId: string; targetId: string; };
  "relationship:update": { id: string; updates: any; };
  "relationship:delete": { id: string; };

  // Tag events
  "tag:create": { id: string; name: string; color?: string; };
  "tag:update": { id: string; updates: any; };
  "tag:delete": { id: string; };
  "tag:assign": { tagId: string; itemId: string; itemType: string; };
  "tag:remove": { tagId: string; itemId: string; };

  // Task events
  "task:create": { id: string; name: string; description?: string; taskType?: string; [key: string]: any; };
  "task:update": { taskId: string; updates: any; };
  "task:delete": { taskId: string; reason?: string; };
  "task:complete": { taskId: string; metrics?: any; };
  "task:dismiss": { taskId: string; habitId?: string; date?: string; };
  "task:reload": {};

  // Timer events
  "timer:start": { taskId?: string; taskName?: string; duration?: number; };
  "timer:pause": { timeLeft: number; pauseCount: number; };
  "timer:resume": {};
  "timer:stop": {};
  "timer:complete": { taskName: string; metrics: any; taskId?: string; };
  "timer:extend": { minutes: number; };
  "timer:reset": {};
  "timer:tick": { timeLeft: number; };
  "timer:set-task": { id: string; name: string; duration?: number; };
  "timer:task-set": { id: string; name: string; duration?: number; };
  "timer:init": { taskName: string; duration: number; taskId?: string; };

  // Journal events
  "journal:create": { id: string; title: string; content: string; date: string; };
  "journal:update": { id: string; updates: any; };
  "journal:delete": { id: string; };

  // Voice note events
  "voicenote:start": { taskId?: string; };
  "voicenote:stop": {};
  "voicenote:transcribe": { audioUrl: string; };
  "voicenote:save": { taskId: string; text: string; url: string; duration: number; };
}
