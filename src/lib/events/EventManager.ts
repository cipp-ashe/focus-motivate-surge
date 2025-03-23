
import mitt from 'mitt';
import type { EventType, EventPayload, EventCallback, EventUnsubscribe } from '@/types/events';
import { logger } from '@/utils/logManager';

/**
 * EventManager is a modern event management system for the application
 * that replaces the legacy eventBus with a more typesafe implementation.
 */
class EventManager {
  private events = mitt<Record<EventType, any>>();
  private eventCounts: Record<string, number> = {};
  private debug = false;

  constructor() {
    this.resetEventCounts();
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
    if (event !== '*') {
      this.events.emit('*', { 
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

// Singleton instance
export const eventManager = new EventManager();

// Export the class for testing
export default EventManager;
