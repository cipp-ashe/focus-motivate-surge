
export interface TimerEventPayloads {
  // Habit events
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  };
  'habit:template-update': any;
  'habit:template-delete': { 
    templateId: string;
    suppressToast?: boolean;
    isOriginatingAction?: boolean;
  };
  'habit:template-add': string;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': { templateId: string };
  'habit:template-order-update': any[];
  'habit:journal-deleted': {
    habitId: string;
    templateId?: string;
  };
  'habit:journal-complete': any;
  'habit:progress-update': any;
  'habit:task-deleted': any;
  'habits:check-pending': any;
  'habits:processed': any;
  
  // Task events
  'task:create': any;
  'task:update': any;
  'task:delete': any;
  'task:select': string;
  'task:complete': {
    taskId: string;
    metrics?: any;
  };
  'tasks:force-update': {
    timestamp: string;
  };
  
  // Timer events
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:start': any;
  'timer:pause': any;
  'timer:reset': any;
  'timer:complete': any;
  'timer:metrics-update': any;
  'timer:state-update': any;
  'timer:tick': { timeLeft: number };
  'timer:resume': any;
  
  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  
  // Note events
  'note:create': any;
  'note:create-from-habit': {
    habitId: string;
    habitName: string;
    description: string;
    templateId?: string;
    content?: string;
  };
  'note:create-from-voice': {
    voiceNoteId: string;
    title: string;
    content: string;
  };
  'note:view': {
    noteId: string;
  };
  'note:deleted': {
    noteId: string;
  };
  
  // Tag events
  'tag:link': any;
  'tag:unlink': any;
  'tags:force-update': {
    timestamp: string;
  };
  'tag:select': string;
  'tag:remove': any;
  'tag:create': any;
  'tag:delete': any;
  
  // Quote events
  'quote:link-task': any;
  
  // Journal events
  'journal:open': {
    habitId: string;
    habitName: string;
  };
  
  // Navigation events
  'nav:route-change': {
    from: string;
    to: string;
  };
  
  // App events
  'app:initialization-complete': any;
  'page:timer-ready': any;
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = (payload: TimerEventPayloads[T]) => void;
