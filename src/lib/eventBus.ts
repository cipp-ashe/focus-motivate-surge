
import { TimerEventType, TimerEventPayloads, TimerEventCallback } from '@/types/events';

class EventBus {
  private static instance: EventBus;
  private listeners: Map<TimerEventType, Set<Function>>;
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

  on<T extends TimerEventType>(event: T, callback: TimerEventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  off<T extends TimerEventType>(event: T, callback: TimerEventCallback<T>) {
    this.listeners.get(event)?.delete(callback);
  }

  emit<T extends TimerEventType>(event: T, payload: TimerEventPayloads[T]) {
    if (this.debugMode) {
      console.log(`[EventBus] ${event}`, payload);
    }

    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(payload);
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

export const useEventBus = <T extends TimerEventType>(
  event: T,
  callback: TimerEventCallback<T>,
  deps: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, callback);
    return () => unsubscribe();
  }, [event, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};

