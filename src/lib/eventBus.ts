
type EventCallback = (...args: any[]) => void;

export type EventType = 
  // Timer events
  | 'timer:start' 
  | 'timer:pause'
  | 'timer:complete'
  | 'timer:update'
  | 'timer:external-start'
  
  // Task events
  | 'task:create'
  | 'task:update'
  | 'task:complete'
  | 'task:delete'
  | 'task:select'
  
  // Note events
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:link'
  
  // Habit events
  | 'habit:create'
  | 'habit:complete'
  | 'habit:generate-task'
  | 'habit:update-progress'
  
  // Relationship events
  | 'relationship:create'
  | 'relationship:delete'
  | 'relationship:update';

class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventType, Set<EventCallback>>;
  private debugMode: boolean;

  private constructor() {
    this.listeners = new Map();
    this.debugMode = process.env.NODE_ENV === 'development';
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: EventType, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  off(event: EventType, callback: EventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: EventType, ...args: any[]) {
    if (this.debugMode) {
      console.log(`[EventBus] ${event}`, ...args);
    }

    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`[EventBus] Error in ${event} handler:`, error);
      }
    });
  }

  // Clear all listeners - useful for testing
  clear() {
    this.listeners.clear();
  }
}

export const eventBus = EventBus.getInstance();

// Custom hook for using EventBus in components
import { useEffect } from 'react';

export const useEventBus = (
  event: EventType,
  callback: EventCallback,
  deps: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return () => unsubscribe();
  }, [event, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};
