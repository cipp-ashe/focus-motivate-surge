
import mitt, { Emitter } from 'mitt';
import { Note } from '@/types/notes';
import { TimerEventType, TimerEventPayloads } from '@/types/events';

// Define all possible events for the application
// This should be synchronized with TimerEventPayloads in types/events.ts
type Events = {
  'timer:start': { taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskName: string; timeLeft?: number; metrics?: any };
  'timer:resume': { taskName: string };
  'timer:complete': { taskName: string; metrics?: any };
  'timer:reset': { taskName: string; duration?: number };
  'timer:tick': { taskName: string; remaining: number; timeLeft?: number };
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:metrics-update': { taskName: string; metrics: any };
  'timer:state-update': { taskName: string; timeLeft?: number; isRunning?: boolean; state?: any; metrics?: any };
  'timer:set-task': { id: string; name: string; duration?: number } | any;
  'note:create': Note;
  'note:update': Note;
  'note:delete': { id: string };
  'note:deleted': { id: string; noteId?: string };
  'note:view': { noteId: string };
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
  'note:format': { noteId: string; action: string };
  'note:format-complete': { noteId: string };
  'note:save': Note;
  // Task events
  'task:create': any;
  'task:update': any;
  'task:delete': any;
  'task:select': any;
  'task:complete': any;
  'task:reload': any;
  'tasks:force-update': any;
  // Habit events
  'habit:schedule': any;
  'habit:template-add': any;
  'habit:template-update': any;
  'habit:template-delete': any;
  'habit:template-order-update': any;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': any;
  'habit:journal-complete': any;
  'habit:journal-deleted': any;
  'habit:progress-update': any;
  'habit:task-deleted': any;
  'habit:select': string;
  // Relationship events
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  // Tag events
  'tag:link': any;
  'tag:unlink': any;
  'tags:force-update': any;
  'tag:select': string;
  'tag:remove': any;
  'tag:create': any;
  'tag:delete': any;
  // Quote events
  'quote:link-task': any;
  // Journal events
  'journal:open': any;
  // Page events
  'page:timer-ready': any;
  // Habits check events
  'habits:check-pending': any;
  'habits:processed': any;
  // Navigation events
  'nav:route-change': { from: string; to: string };
  'app:initialization-complete': any;
};

// Export event type and handler for use in other modules
export type EventType = keyof Events;
export type EventHandler<T extends EventType> = (payload: Events[T]) => void;

// Make sure all the event types from TimerEventPayloads are included in Events
export type EventPayloads = Events;

class EventManager {
  private emitter: Emitter<Events>;

  constructor() {
    this.emitter = mitt<Events>();
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.emitter.emit(event, payload);
  }

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    this.emitter.on(event, handler as any);
    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler?: (payload: Events[K]) => void) {
    this.emitter.off(event, handler as any);
  }

  // For testing purposes
  clear() {
    this.emitter.all.clear();
  }
}

export const eventManager = new EventManager();
