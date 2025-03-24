
/**
 * Event Utility Functions
 * 
 * Common utilities for working with the event system
 */

import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload } from '@/types/events';

/**
 * Emit an event with payload
 */
export function emitEvent<E extends EventType>(
  eventType: E, 
  payload?: EventPayload<E>
): void {
  eventManager.emit(eventType, payload);
}

/**
 * Subscribe to an event
 */
export function subscribeToEvent<E extends EventType>(
  eventType: E,
  handler: (payload: EventPayload<E>) => void
): () => void {
  return eventManager.on(eventType, handler);
}

/**
 * Subscribe to multiple events with the same handler
 */
export function subscribeToEvents<E extends EventType>(
  eventTypes: E[],
  handler: (eventType: E, payload: EventPayload<E>) => void
): () => void {
  const unsubscribers = eventTypes.map(eventType => 
    eventManager.on(eventType, (payload) => handler(eventType, payload))
  );
  
  return () => unsubscribers.forEach(unsubscribe => unsubscribe());
}

/**
 * One-time event subscription
 */
export function subscribeToEventOnce<E extends EventType>(
  eventType: E,
  handler: (payload: EventPayload<E>) => void
): () => void {
  const unsubscribe = eventManager.on(eventType, (payload) => {
    handler(payload);
    unsubscribe();
  });
  
  return unsubscribe;
}
