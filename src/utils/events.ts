
/**
 * Event Utility Functions
 * 
 * Common utilities for working with the event system
 */

import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload, EventUnsubscribe } from '@/types/events';

/**
 * Emit an event with payload
 */
export function emitEvent<E extends EventType>(
  eventType: E, 
  payload?: EventPayload<E>
): void {
  console.log(`emitEvent: Emitting ${eventType}`, payload);
  eventManager.emit(eventType, payload);
}

/**
 * Subscribe to an event
 */
export function subscribeToEvent<E extends EventType>(
  eventType: E,
  handler: (payload: EventPayload<E>) => void
): EventUnsubscribe {
  return eventManager.on(eventType, handler);
}

/**
 * Subscribe to multiple events with the same handler
 */
export function subscribeToEvents<E extends EventType>(
  eventTypes: E[],
  handler: (eventType: E, payload: EventPayload<E>) => void
): EventUnsubscribe {
  const unsubscribers = eventTypes.map(eventType => 
    eventManager.on(eventType, (payload: any) => handler(eventType, payload))
  );
  
  return () => unsubscribers.forEach(unsubscribe => unsubscribe());
}

/**
 * One-time event subscription
 */
export function subscribeToEventOnce<E extends EventType>(
  eventType: E,
  handler: (payload: EventPayload<E>) => void
): EventUnsubscribe {
  return eventManager.once(eventType, handler);
}

/**
 * Debounced event emission
 */
export function emitEventDebounced<E extends EventType>(
  eventType: E,
  payload?: EventPayload<E>,
  delay: number = 300
): void {
  const timeoutId = setTimeout(() => {
    eventManager.emit(eventType, payload);
  }, delay);
  
  return () => clearTimeout(timeoutId);
}

/**
 * Create an event bridge between two event types
 */
export function createEventBridge<S extends EventType, T extends EventType>(
  sourceEventType: S,
  targetEventType: T,
  transform?: (payload: EventPayload<S>) => EventPayload<T>
): EventUnsubscribe {
  return eventManager.on(sourceEventType, (payload) => {
    const transformedPayload = transform ? transform(payload) : payload;
    eventManager.emit(targetEventType, transformedPayload);
  });
}
