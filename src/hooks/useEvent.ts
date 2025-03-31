
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload, EventUnsubscribe, EventCallback } from '@/types/events';

/**
 * Hook to subscribe to application events
 * 
 * @param eventName The name of the event to subscribe to
 * @param callback The function to call when the event is emitted
 */
export function useEvent<E extends EventType>(
  eventName: E, 
  callback: EventCallback<E>
): void {
  // Ensure callback is stable using useCallback
  const stableCallback = useCallback(callback, [callback]);
  
  useEffect(() => {
    // Subscribe to the event when the component mounts
    const unsubscribe = eventManager.on(eventName, stableCallback);
    
    // Cleanup subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [eventName, stableCallback]);
}

/**
 * Hook for emitting events
 * 
 * Returns functions for emitting events and managing subscriptions
 */
export function useEventEmitter() {
  /**
   * Emit an event with optional payload
   */
  const emit = useCallback(<E extends EventType>(
    eventType: E, 
    payload?: EventPayload<E>
  ): void => {
    eventManager.emit(eventType, payload);
  }, []);
  
  /**
   * Subscribe to an event
   */
  const subscribe = useCallback(<E extends EventType>(
    eventType: E,
    handler: EventCallback<E>
  ): EventUnsubscribe => {
    return eventManager.on(eventType, handler);
  }, []);
  
  /**
   * Subscribe to an event once
   */
  const subscribeOnce = useCallback(<E extends EventType>(
    eventType: E,
    handler: EventCallback<E>
  ): EventUnsubscribe => {
    return eventManager.once(eventType, handler);
  }, []);
  
  return { emit, subscribe, subscribeOnce };
}
