import { TimerEventType, TimerEventPayloads, TimerEventCallback } from '@/types/events';

/**
 * Event Bus implementation following the Observer pattern
 * Handles all application events in a centralized manner
 */
class EventBus {
  private static instance: EventBus;
  private listeners: Map<TimerEventType, Set<Function>>;
  private debugMode: boolean;
  private processedEvents: Map<string, Set<string>>;

  private constructor() {
    this.listeners = new Map();
    this.debugMode = process.env.NODE_ENV === 'development';
    this.processedEvents = new Map();
    this.setupEventDeduplication();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Sets up event deduplication system
   * Clears processed events at midnight to allow new day's processing
   */
  private setupEventDeduplication() {
    const resetProcessedEvents = () => {
      this.processedEvents.clear();
      this.scheduleNextReset();
    };

    this.scheduleNextReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      setTimeout(resetProcessedEvents, timeUntilMidnight);
    };

    this.scheduleNextReset();
  }

  private scheduleNextReset: () => void;

  /**
   * Checks if an event with the given ID has already been processed today
   */
  private hasProcessedEvent(eventType: string, eventId: string): boolean {
    const processed = this.processedEvents.get(eventType)?.has(eventId) ?? false;
    if (!processed) {
      const eventSet = this.processedEvents.get(eventType) || new Set();
      eventSet.add(eventId);
      this.processedEvents.set(eventType, eventSet);
    }
    return processed;
  }

  /**
   * Subscribe to an event
   */
  on<T extends TimerEventType>(event: T, callback: TimerEventCallback<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends TimerEventType>(event: T, callback: TimerEventCallback<T>) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit an event with payload
   */
  emit<T extends TimerEventType>(event: T, payload: TimerEventPayloads[T]) {
    if (this.debugMode) {
      console.log(`[EventBus] ${event}`, payload);
    }

    // Handle special cases for deduplication
    if (event === 'habit:schedule') {
      const habitId = (payload as any).habitId;
      if (this.hasProcessedEvent('habit:schedule', habitId)) {
        console.log(`[EventBus] Skipping duplicate habit schedule for ${habitId}`);
        return;
      }
    }

    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`[EventBus] Error in ${event} handler:`, error);
      }
    });
  }

  /**
   * Clear all listeners - useful for testing
   */
  clear() {
    this.listeners.clear();
    this.processedEvents.clear();
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
