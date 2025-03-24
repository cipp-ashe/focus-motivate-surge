
/**
 * Event Bus
 * 
 * A centralized event bus for application-wide events
 * This is a compatibility layer for older code that used a separate eventBus implementation
 */

import { eventManager } from './events/EventManager';
import { EventType, EventPayload, EventUnsubscribe } from '@/types';

// Re-export the event manager instance as the event bus for backward compatibility
export const eventBus = {
  /**
   * Subscribe to an event
   * @param eventType The event type to subscribe to
   * @param callback The callback to invoke when the event occurs
   * @returns A function to unsubscribe from the event
   */
  on: <E extends EventType>(eventType: E, callback: (payload: EventPayload<E>) => void): EventUnsubscribe => {
    return eventManager.on(eventType, callback);
  },
  
  /**
   * Emit an event
   * @param eventType The event type to emit
   * @param payload The event payload
   */
  emit: <E extends EventType>(eventType: E, payload?: EventPayload<E>): void => {
    eventManager.emit(eventType, payload);
  },
  
  /**
   * Unsubscribe from an event
   * @param eventType The event type to unsubscribe from
   * @param callback The callback to unsubscribe
   */
  off: <E extends EventType>(eventType: E, callback: (payload: EventPayload<E>) => void): void => {
    eventManager.off(eventType, callback);
  },
  
  /**
   * Subscribe to an event once
   * @param eventType The event type to subscribe to
   * @param callback The callback to invoke when the event occurs
   * @returns A function to unsubscribe from the event
   */
  once: <E extends EventType>(eventType: E, callback: (payload: EventPayload<E>) => void): EventUnsubscribe => {
    return eventManager.once(eventType, callback);
  },
  
  /**
   * Trigger a task update (for backward compatibility)
   */
  forceTaskUpdate: (): void => {
    eventManager.emit('task:reload');
  }
};

// Export for backward compatibility
export default eventBus;
