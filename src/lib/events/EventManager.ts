
import mitt from 'mitt';
import type { EventType, EventPayload, EventCallback, EventUnsubscribe } from '@/types/events';
import { logger } from '@/utils/logManager';

/**
 * EventManager singleton for centralized event handling
 */
export class EventManager {
  private static instance: EventManager;
  private events = mitt<Record<EventType, any>>();
  private eventCounts: Record<string, number> = {};
  private debug = false;

  private constructor() {
    this.resetEventCounts();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  /**
   * Enable or disable debug mode
   */
  setDebug(enable: boolean): void {
    this.debug = enable;
  }

  /**
   * Reset event counts, used for debugging
   */
  resetEventCounts(): void {
    this.eventCounts = {};
  }

  /**
   * Get the current count of all events
   */
  getEventCounts(): Record<string, number> {
    return { ...this.eventCounts };
  }

  /**
   * Get the listener counts for all events
   */
  getListenerCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    const allEvents = this.events.all;
    
    for (const event in allEvents) {
      const handlers = allEvents[event as EventType];
      if (handlers) {
        counts[event] = handlers.length;
      }
    }
    
    return counts;
  }

  /**
   * Emit an event with a payload
   */
  emit<E extends EventType>(event: E, payload?: EventPayload<E>): void {
    // Track event count
    this.eventCounts[event] = (this.eventCounts[event] || 0) + 1;
    
    // Log event for debugging
    if (this.debug) {
      logger.debug('EventManager', `Emit: ${event}`, payload);
    }
    
    // Dispatch event through mitt
    this.events.emit(event, payload);
    
    // Also dispatch to wildcard listeners
    if (event !== '*' as EventType) {
      this.events.emit('*' as EventType, { 
        eventType: event, 
        payload,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Listen for an event
   */
  on<E extends EventType>(event: E, handler: EventCallback<E>): EventUnsubscribe {
    this.events.on(event, handler as any);
    
    return () => {
      this.events.off(event, handler as any);
    };
  }

  /**
   * Remove an event listener
   */
  off<E extends EventType>(event: E, handler: EventCallback<E>): void {
    this.events.off(event, handler as any);
  }

  /**
   * Listen for an event only once
   */
  once<E extends EventType>(event: E, handler: EventCallback<E>): EventUnsubscribe {
    const onceHandler = ((payload: any) => {
      handler(payload);
      this.off(event, onceHandler as any);
    }) as any;
    
    this.on(event, onceHandler);
    
    return () => {
      this.off(event, onceHandler);
    };
  }

  /**
   * Clear all event listeners
   */
  clear(): void {
    this.events.all.clear();
  }
}

// Export the singleton instance
export const eventManager = EventManager.getInstance();

// For testing purposes
export default EventManager;
