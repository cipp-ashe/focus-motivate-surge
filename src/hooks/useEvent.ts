import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import type { EventType, EventCallback } from '@/types/events';

/**
 * Hook for subscribing to events from the event manager
 * 
 * @param eventType The event type to subscribe to
 * @param callback The callback to execute when the event is triggered
 * @param deps Dependencies for the hook (defaults to [])
 */
export function useEvent<E extends EventType>(
  eventType: E,
  callback: EventCallback<E>,
  deps: any[] = []
) {
  // Keep a reference to the callback to avoid unnecessary re-subscriptions
  const callbackRef = useRef(callback);
  
  // Update the callback reference when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Set up the event subscription
  useEffect(() => {
    // Create wrapper to ensure we always use the latest callback
    const eventHandler: EventCallback<E> = (payload) => {
      callbackRef.current(payload);
    };
    
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventType, eventHandler);
    
    // Clean up subscription on unmount
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, ...deps]);
}

/**
 * Hook for subscribing to multiple events from the event manager
 * 
 * @param eventMap Object mapping event types to their handlers
 * @param deps Dependencies for the hook (defaults to [])
 */
export function useEvents(
  eventMap: Partial<Record<EventType, (payload: any) => void>>,
  deps: any[] = []
) {
  // Set up subscriptions for all events
  useEffect(() => {
    // Create an array to track all unsubscribe functions
    const unsubscribes: Array<() => void> = [];
    
    // Subscribe to each event in the map
    Object.entries(eventMap).forEach(([eventType, handler]) => {
      if (handler) {
        const unsubscribe = eventManager.on(eventType as EventType, handler);
        unsubscribes.push(unsubscribe);
      }
    });
    
    // Clean up all subscriptions on unmount
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
