
// Define custom event types for the app
export type EventType = 
  // Note events
  | 'note:create' | 'note:update' | 'note:delete' | 'note:select' | 'note:create-from-habit'
  | 'note:format' | 'note:format-complete' | 'note:view' | 'note:deleted'
  
  // Timer events
  | 'timer:start' | 'timer:pause' | 'timer:resume' | 'timer:tick' | 'timer:complete'
  | 'timer:reset' | 'timer:init' | 'timer:close' | 'timer:metrics-update'
  
  // Task events
  | 'task:create' | 'task:update' | 'task:delete' | 'task:complete' | 'task:dismiss'
  | 'task:reload' | 'task:force-update'
  
  // Habit events
  | 'habit:template-delete' | 'habit:template-update' | 'habit:custom-template-delete'
  | 'habit:dismissed' | 'habit:tasks-sync' | 'habits:verify-tasks' | 'habit:check-pending'
  | 'habit:select' | 'habit:schedule'
  
  // Voice note events
  | 'voice-note:created' | 'voice-note:deleted' | 'note:create-from-voice'
  
  // App events
  | 'app:initialized'
  
  // Relationship events
  | 'relationship:create' | 'relationship:delete' | 'relationship:update' | 'relationship:batch-update'
  | 'tag:link' | 'tag:unlink' | 'quote:link-task'
  
  // Journal events
  | 'journal:open';

// Generic event payload interface
export interface EventPayload<T extends EventType> {}

// Create a unified event handler type
export type EventCallback<E extends EventType> = (payload: string) => void;
