
import { Task } from '@/types/tasks';
import { TimerStateMetrics } from '@/types/metrics';

// Event Types with proper typing
export type TaskEventPayload = {
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string; suppressToast?: boolean };
  'task:select': string;
  'task:complete': { taskId: string; metrics?: TimerStateMetrics };
  'tasks:force-update': { timestamp: string };
};

export type HabitEventPayload = {
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  };
  'habit:template-add': string;
  'habit:template-update': any;
  'habit:template-delete': { 
    templateId: string; 
    suppressToast?: boolean; 
    isOriginatingAction?: boolean 
  };
  'habit:template-order-update': any[];
  'habit:custom-template-create': any;
  'habit:custom-template-delete': { templateId: string };
  'habit:journal-deleted': {
    habitId: string;
    templateId?: string;
  };
  'habit:journal-complete': any;
  'habit:progress-update': any;
  'habit:deleted': any;
  'habit:journal-create': any;
  'habit:task-deleted': any;
  'habits:check-pending': any;
  'habits:processed': any;
};

export type TimerEventPayload = {
  'timer:init': { taskName: string; duration: number };
  'timer:start': { taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskName: string; timeLeft: number; metrics: any };
  'timer:reset': { taskName: string; duration: number };
  'timer:complete': { taskName: string; metrics: any };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:metrics-update': { taskName: string; metrics: any };
  'timer:state-update': { taskName: string; timeLeft: number; isRunning: boolean; metrics: any };
  'timer:tick': any;
  'timer:resume': any;
};

export type SystemEventPayload = {
  'page:timer-ready': { timestamp: string };
  'tags:force-update': { timestamp: string };
  'nav:route-change': { from: string; to: string };
  'app:initialization-complete': any;
  'journal:open': { habitId: string; habitName: string };
  'note:create': any;
  'note:create-from-habit': {
    habitId: string;
    habitName: string;
    description: string;
    templateId?: string;
    content?: string;
  };
  'note:delete': any;
  'note:deleted': {
    noteId: string;
  };
  'tag:link': any;
  'tag:unlink': any;
  'quote:link-task': any;
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
};

// Combine all event types
export type EventPayload = TaskEventPayload & HabitEventPayload & TimerEventPayload & SystemEventPayload;
export type EventType = keyof EventPayload;

// Event handler type
export type EventHandler<T extends EventType> = (payload: EventPayload[T]) => void;

// Event timing tracking
interface EventTiming {
  lastEmitted: number;
  debounceInterval: number;
  timeout?: NodeJS.Timeout;
}

// EventManager class
export class EventManager {
  private listeners: Map<EventType, Set<EventHandler<any>>> = new Map();
  private timings: Map<string, EventTiming> = new Map();
  private pendingEvents: Map<string, { type: EventType; payload: any; timestamp: number }> = new Map();
  private isDebugMode: boolean = false;
  
  // Default debounce intervals
  private defaultDebounceIntervals: Record<EventType, number> = {
    'habit:schedule': 300,
    'habit:template-add': 500,
    'task:update': 200,
    'task:create': 200,
    'habits:processed': 300,
    'habits:check-pending': 100,
  } as Record<EventType, number>;

  constructor(options?: { debug?: boolean }) {
    this.isDebugMode = options?.debug || false;
    
    // Set up listeners for page navigation
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.logDebug('Page navigation detected, processing pending events');
        this.processPendingEvents();
      });
      
      // Process pending events regularly
      setInterval(() => {
        this.processPendingEvents();
      }, 5000);
    }
  }

  // Subscribe to an event
  public on<T extends EventType>(eventType: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.off(eventType, handler);
    };
  }

  // Unsubscribe from an event
  public off<T extends EventType>(eventType: T, handler: EventHandler<T>): void {
    if (!this.listeners.has(eventType)) return;
    
    const handlers = this.listeners.get(eventType)!;
    handlers.delete(handler);
    
    if (handlers.size === 0) {
      this.listeners.delete(eventType);
    }
  }

  // Emit an event with proper typing
  public emit<T extends EventType>(eventType: T, payload: EventPayload[T]): void {
    this.logDebug(`Emitting ${eventType}`, payload);
    
    // Always store critical events that might need to be reprocessed
    if (['habit:schedule', 'habit:template-add', 'habit:template-update'].includes(eventType as string)) {
      this.storePendingEvent(eventType, payload);
    }
    
    // For habit:schedule, always process immediately regardless of debounce
    if (eventType === 'habit:schedule') {
      this.executeEvent(eventType, payload);
      return;
    }
    
    // For events that need debouncing
    const debounceInterval = this.defaultDebounceIntervals[eventType] || 0;
    if (debounceInterval > 0) {
      const now = Date.now();
      
      // Generate a unique key for debouncing if we have identifiable properties
      let debounceKey = eventType as string;
      
      // For template addition, create a unique key based on templateId
      if (eventType === 'habit:template-add' && typeof payload === 'string') {
        debounceKey = `${eventType}-${payload}`;
      }
      // For task operations, create a unique key based on taskId
      else if ((eventType === 'task:update' || eventType === 'task:create') && 'taskId' in payload) {
        debounceKey = `${eventType}-${(payload as any).taskId}`;
      }
      
      const timing = this.timings.get(debounceKey) || {
        lastEmitted: 0,
        debounceInterval
      };
      
      // Check if we've emitted this event recently
      if (timing.lastEmitted && (now - timing.lastEmitted < debounceInterval)) {
        this.logDebug(`Debouncing ${eventType} with ID ${debounceKey}, last emitted ${now - timing.lastEmitted}ms ago`);
        
        // Clear existing timeout
        if (timing.timeout) {
          clearTimeout(timing.timeout);
        }
        
        // Set new timeout
        timing.timeout = setTimeout(() => {
          this.executeEvent(eventType, payload);
          timing.lastEmitted = Date.now();
          timing.timeout = undefined;
        }, debounceInterval);
        
        this.timings.set(debounceKey, timing);
        return;
      }
      
      // Update last emitted time
      timing.lastEmitted = now;
      this.timings.set(debounceKey, timing);
    }
    
    // For non-debounced events or the first emission of a debounced event
    this.executeEvent(eventType, payload);
  }

  // Execute event by calling all registered handlers
  private executeEvent<T extends EventType>(eventType: T, payload: EventPayload[T]): void {
    if (!this.listeners.has(eventType)) return;
    
    // Create a copy of handlers to avoid issues if handlers modify the listeners
    const handlers = Array.from(this.listeners.get(eventType)!);
    
    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  // Store events that might need to be reprocessed on page navigation
  private storePendingEvent<T extends EventType>(eventType: T, payload: EventPayload[T]): void {
    const storageKey = `${eventType}-${Date.now()}`;
    this.pendingEvents.set(storageKey, {
      type: eventType,
      payload,
      timestamp: Date.now()
    });
    
    // Limit the number of pending events
    if (this.pendingEvents.size > 100) {
      // Remove oldest events if we have too many
      const oldestKey = Array.from(this.pendingEvents.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.pendingEvents.delete(oldestKey);
    }
  }

  // Process pending events, typically after page navigation
  private processPendingEvents(): void {
    const now = Date.now();
    let count = 0;
    
    // Get all pending events less than 1 minute old
    const recentEvents = Array.from(this.pendingEvents.entries())
      .filter(([_, event]) => (now - event.timestamp) < 60000);
    
    if (recentEvents.length > 0) {
      this.logDebug(`Processing ${recentEvents.length} pending events after navigation`);
      
      // Process events
      recentEvents.forEach(([key, event]) => {
        // Only process certain event types that are likely to need replaying
        if (event.type === 'habit:schedule') {
          this.logDebug(`Reprocessing pending event ${event.type}`, event.payload);
          this.executeEvent(event.type, event.payload);
          count++;
        }
        
        // Remove from pending events
        this.pendingEvents.delete(key);
      });
      
      // Force task update if we processed any events
      if (count > 0 && typeof window !== 'undefined') {
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
          window.dispatchEvent(new Event('force-tags-update'));
        }, 200);
      }
    }
  }

  // Helper for debug logging
  private logDebug(message: string, data?: any): void {
    if (this.isDebugMode) {
      console.log(`[EventManager] ${message}`, data);
    }
  }

  // Clear all event listeners and timeouts
  public clear(): void {
    this.listeners.clear();
    // Clear all debounce timeouts
    this.timings.forEach(timing => {
      if (timing.timeout) {
        clearTimeout(timing.timeout);
      }
    });
    this.timings.clear();
    this.pendingEvents.clear();
  }
}

// Create and export a singleton instance
export const eventManager = new EventManager({ debug: process.env.NODE_ENV === 'development' });
