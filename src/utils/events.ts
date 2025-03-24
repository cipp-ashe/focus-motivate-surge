
/**
 * Event Utility Functions
 * 
 * Common utilities for working with the event system
 */

import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload, EventUnsubscribe } from '@/types';

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
  const unsubscribe = eventManager.on(eventType, (payload: any) => {
    handler(payload);
    unsubscribe();
  });
  
  return unsubscribe;
}
