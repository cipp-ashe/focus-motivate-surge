
export interface TimerEventPayloads {
  // Habit events
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
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
  'habit:select': string;
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
  'task:reload': any;
  'tasks:force-update': {
    timestamp: string;
  };
  'timer:set-task': { id: string; name: string; duration?: number } | any;
  
  // Timer events
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:start': { taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskName: string; timeLeft?: number; metrics?: any };
  'timer:reset': { taskName: string; duration?: number };
  'timer:complete': { taskName: string; metrics?: any };
  'timer:metrics-update': { taskName: string; metrics: any };
  'timer:state-update': { taskName: string; timeLeft?: number; isRunning?: boolean; state?: any; metrics?: any };
  'timer:tick': { timeLeft?: number; remaining?: number; taskName?: string };
  'timer:resume': { taskName: string };
  
  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  
  // Note events
  'note:create': any;
  'note:update': any;
  'note:delete': { id: string };
  'note:create-from-habit': {
    habitId: string;
    habitName: string;
    description?: string;
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
    id: string;
    noteId?: string;
  };
  'note:format': { 
    noteId: string; 
    action: string 
  };
  'note:format-complete': { 
    noteId: string 
  };
  'note:save': any;
  
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
