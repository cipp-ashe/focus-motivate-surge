
import { useEffect, useRef, useCallback } from 'react';
import { eventManager, EventType, EventPayloads } from '@/lib/events/EventManager';

/**
 * Hook to subscribe to a specific event and handle it
 * 
 * @param eventType - The event type to subscribe to
 * @param callback - The callback to run when the event is emitted
 */
export function useEvent<T extends EventType>(
  eventType: T,
  callback: (payload: EventPayloads[T]) => void
) {
  // Keep track of the latest callback
  const callbackRef = useRef(callback);
  
  // Update the ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Create a stable wrapper function
  const stableCallback = useCallback((payload: any) => {
    callbackRef.current(payload as EventPayloads[T]);
  }, []);
  
  useEffect(() => {
    console.log(`[useEvent] Subscribing to event: ${eventType}`);
    
    // Subscribe to the event with the stable callback
    const unsubscribe = eventManager.on(eventType, stableCallback);
    
    // Return cleanup function
    return () => {
      console.log(`[useEvent] Unsubscribing from event: ${eventType}`);
      unsubscribe();
    };
  }, [eventType, stableCallback]);
}
