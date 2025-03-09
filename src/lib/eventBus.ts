
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
  private processingEvents: Map<string, boolean>; // Track events currently being processed
  private emitCounts: Map<string, number>; // Track how many times an event has been emitted
  private lastEmitTimestamps: Map<string, number>; // Track when events were last emitted

  private constructor() {
    this.listeners = new Map();
    this.debugMode = process.env.NODE_ENV === 'development';
    this.processedEvents = new Map();
    this.processingEvents = new Map();
    this.emitCounts = new Map();
    this.lastEmitTimestamps = new Map();
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
      this.emitCounts.clear();
      this.lastEmitTimestamps.clear();
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
   * Generate a unique identifier for an event based on its payload
   */
  private getEventId(event: TimerEventType, payload: any): string {
    if (event === 'habit:schedule' && payload?.habitId && payload?.date) {
      return `${payload.habitId}-${payload.date}`;
    }
    
    // For habit:template-add events, use the template ID
    if (event === 'habit:template-add' && typeof payload === 'string') {
      return payload;
    }
    
    // For habit:template-delete events
    if (event === 'habit:template-delete' && payload?.templateId) {
      return payload.templateId;
    }
    
    // For other events, create a hash from the payload
    return JSON.stringify(payload);
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

    // Generate a unique event ID for deduplication
    const eventId = this.getEventId(event, payload);
    
    // Check if this is a rapid repeat of the same event (debounce)
    const now = Date.now();
    const lastEmitTime = this.lastEmitTimestamps.get(`${event}-${eventId}`) || 0;
    const timeSinceLastEmit = now - lastEmitTime;
    
    // Strong debounce for template-add events (1000ms)
    if (event === 'habit:template-add' && timeSinceLastEmit < 1000) {
      if (this.debugMode) {
        console.log(`[EventBus] Debouncing ${event} with ID ${eventId}, last emitted ${timeSinceLastEmit}ms ago`);
      }
      return;
    }
    
    // Normal debounce for other events (300ms)
    if (timeSinceLastEmit < 300 && (event === 'habit:schedule' || event.includes('template'))) {
      if (this.debugMode) {
        console.log(`[EventBus] Debouncing ${event} with ID ${eventId}, last emitted ${timeSinceLastEmit}ms ago`);
      }
      return;
    }
    
    // Update last emit timestamp
    this.lastEmitTimestamps.set(`${event}-${eventId}`, now);
    
    // Track emit counts for debugging
    const countKey = `${event}-${eventId}`;
    const currentCount = this.emitCounts.get(countKey) || 0;
    this.emitCounts.set(countKey, currentCount + 1);
    
    if (currentCount > 0 && (event === 'habit:schedule' || event === 'habit:template-add')) {
      if (this.debugMode) {
        console.log(`[EventBus] Event ${event} with ID ${eventId} has been emitted ${currentCount + 1} times, throttling`);
      }
      
      // Special handling for frequently emitted events
      if (currentCount > 2) {
        if (this.debugMode) {
          console.log(`[EventBus] Skipping overly repeated event ${event} with ID ${eventId}`);
        }
        return;
      }
    }
    
    // Check if this specific event is currently being processed
    const processingKey = `${event}-${eventId}`;
    if (this.processingEvents.get(processingKey)) {
      if (this.debugMode) {
        console.log(`[EventBus] Event ${event} with ID ${eventId} is already being processed, skipping`);
      }
      return;
    }
    
    // Handle special cases for deduplication based on event type
    if (event === 'habit:schedule') {
      const habitId = (payload as any).habitId;
      if (this.hasProcessedEvent('habit:schedule', habitId)) {
        console.log(`[EventBus] Skipping duplicate habit schedule for ${habitId}`);
        return;
      }
    }
    
    // For template-add events, ensure they're only processed once per day
    if (event === 'habit:template-add') {
      const templateId = payload as string;
      if (this.hasProcessedEvent('habit:template-add', templateId)) {
        console.log(`[EventBus] Skipping duplicate template addition for ${templateId}`);
        return;
      }
    }

    // Set processing flag
    this.processingEvents.set(processingKey, true);
    
    // Process the event
    try {
      this.listeners.get(event)?.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[EventBus] Error in ${event} handler:`, error);
        }
      });
    } finally {
      // Clear processing flag after a short delay
      setTimeout(() => {
        this.processingEvents.delete(processingKey);
      }, 50);
    }
  }

  /**
   * Clear all listeners - useful for testing
   */
  clear() {
    this.listeners.clear();
    this.processedEvents.clear();
    this.processingEvents.clear();
    this.emitCounts.clear();
    this.lastEmitTimestamps.clear();
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
