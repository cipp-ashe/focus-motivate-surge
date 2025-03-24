
/**
 * Event Utility Functions
 * 
 * Common utilities for working with events
 */

import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload } from '@/types';

/**
 * Safely emit an event with error handling
 * @param eventType The event type to emit
 * @param payload The event payload
 * @returns Boolean indicating if the event was successfully emitted
 */
export function safeEmit<E extends EventType>(eventType: E, payload?: EventPayload<E>): boolean {
  try {
    eventManager.emit(eventType, payload);
    return true;
  } catch (error) {
    console.error(`Error emitting event ${eventType}:`, error);
    return false;
  }
}

/**
 * Debounce an event emission
 * @param eventType The event type to emit
 * @param payload The event payload
 * @param delay The debounce delay in milliseconds
 * @returns A function to cancel the debounced emission
 */
export function debounceEvent<E extends EventType>(
  eventType: E, 
  payload?: EventPayload<E>, 
  delay: number = 300
): () => void {
  const timeoutId = setTimeout(() => {
    eventManager.emit(eventType, payload);
  }, delay);
  
  return () => clearTimeout(timeoutId);
}

/**
 * Create a proxied event subscription that allows transformation of event data
 * @param sourceEvent The source event to subscribe to
 * @param targetEvent The target event to emit
 * @param transformFn Optional function to transform the payload
 * @returns A function to unsubscribe from the event
 */
export function proxyEvent<S extends EventType, T extends EventType>(
  sourceEvent: S,
  targetEvent: T,
  transformFn?: (payload: EventPayload<S>) => EventPayload<T>
) {
  return eventManager.on(sourceEvent, (payload) => {
    const transformedPayload = transformFn ? transformFn(payload) : payload;
    eventManager.emit(targetEvent, transformedPayload as EventPayload<T>);
  });
}
