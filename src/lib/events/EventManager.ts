import mitt, { Emitter } from 'mitt';
import { Note } from '@/types/notes';
import { TimerEventType, TimerEventPayloads } from '@/types/events';
import { logger } from '@/utils/logManager';

// Define all possible events for the application
// This should be synchronized with TimerEventPayloads in types/events.ts
type Events = {
  'timer:start': { taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskName: string; timeLeft: number; metrics?: any };
  'timer:resume': { taskName: string; timeLeft: number; currentTime?: number; metrics?: any };
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
  'task:create': any;
  'task:update': any;
  'task:delete': any;
  'task:select': any;
  'task:complete': any;
  'task:dismiss': {
    taskId: string;
    habitId: string;
    date: string;
  };
  'task:reload': any;
  'tasks:force-update': any;
  'show-image': { taskId: string; imageUrl: string; taskName: string };
  'open-checklist': { taskId: string; taskName: string; items: any[] };
  'open-journal': { taskId: string; taskName: string; entry: string };
  'open-voice-recorder': { taskId: string; taskName: string };
  'habit:complete': { 
    habitId: string; 
    completed: boolean; 
    date?: string;
    templateId?: string;
  };
  'habit:dismissed': {
    habitId: string;
    date: string;
  };
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
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  'tag:link': any;
  'tag:unlink': any;
  'tags:force-update': any;
  'tag:select': string;
  'tag:remove': any;
  'tag:create': any;
  'tag:delete': any;
  'quote:link-task': any;
  'journal:open': any;
  'page:timer-ready': any;
  'habits:check-pending': any;
  'habits:processed': any;
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
  private static instanceCount: number = 0;
  private id: number;
  
  // Map to prevent duplicate event registrations with same handler
  private registeredHandlers: Map<string, Set<Function>> = new Map();
  
  // Keep track of listener counts per event type for debugging
  private listenerCounts: Map<string, number> = new Map();

  constructor() {
    this.emitter = mitt<Events>();
    this.id = ++EventManager.instanceCount;
    logger.info('EventManager', `EventManager instance #${this.id} created`);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    // Log the event with throttling for high-frequency events like timer:tick
    const highFrequencyEvents = ['timer:tick'];
    const throttleTime = highFrequencyEvents.includes(event as string) ? 1000 : 0;
    
    logger.logEvent('EventManager', event as string, payload, throttleTime);
    
    this.emitter.emit(event, payload);
  }

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    // Create a unique key for this event+handler combination
    const handlerKey = event as string;
    
    // Get or create the handler set for this event
    if (!this.registeredHandlers.has(handlerKey)) {
      this.registeredHandlers.set(handlerKey, new Set());
      this.listenerCounts.set(handlerKey, 0);
    }
    
    const handlers = this.registeredHandlers.get(handlerKey)!;
    
    // Skip if this exact handler is already registered to prevent duplicates
    if (handlers.has(handler)) {
      logger.warn('EventManager', `Duplicate handler registration for event: ${String(event)}`);
      return () => this.off(event, handler);
    }
    
    // Add the handler to our tracking set
    handlers.add(handler);
    
    // Update listener count
    const currentCount = this.listenerCounts.get(handlerKey) || 0;
    this.listenerCounts.set(handlerKey, currentCount + 1);
    
    logger.debug('EventManager', `Event listener registered: ${String(event)} (total: ${currentCount + 1})`);
    
    this.emitter.on(event, handler as any);
    
    return () => this.off(event, handler);
  }

  off<K extends keyof Events>(event: K, handler?: (payload: Events[K]) => void) {
    const handlerKey = event as string;
    
    if (handler && this.registeredHandlers.has(handlerKey)) {
      const handlers = this.registeredHandlers.get(handlerKey)!;
      if (handlers.has(handler)) {
        handlers.delete(handler);
        
        // Update listener count
        const currentCount = this.listenerCounts.get(handlerKey) || 0;
        this.listenerCounts.set(handlerKey, Math.max(0, currentCount - 1));
        
        logger.debug('EventManager', `Event listener removed: ${String(event)} (total: ${Math.max(0, currentCount - 1)})`);
      }
    }
    
    this.emitter.off(event, handler as any);
  }

  // For testing and debugging purposes
  clear() {
    this.emitter.all.clear();
    this.registeredHandlers.clear();
    this.listenerCounts.clear();
    logger.info('EventManager', 'All event listeners cleared');
  }
  
  // Debugging method to get listener counts
  getListenerCounts() {
    return Object.fromEntries(this.listenerCounts.entries());
  }
}

export const eventManager = new EventManager();

