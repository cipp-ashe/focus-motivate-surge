
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventCallback, EventPayloads } from '@/types/events';

/**
 * Custom hook to subscribe to events with automatic cleanup
 * @param eventType The event to subscribe to
 * @param callback The callback function to be executed when the event is emitted
 */
export function useEvent<T extends EventType>(
  eventType: T, 
  callback: EventCallback<T>
) {
  // Use ref to avoid unnecessary re-subscriptions
  const callbackRef = useRef(callback);
  
  // Update the ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Subscribe to the event and clean up on unmount
  useEffect(() => {
    const wrappedCallback = (payload: EventPayloads[T]) => {
      callbackRef.current(payload);
    };
    
    const unsubscribe = eventManager.on(eventType, wrappedCallback);
    
    return () => {
      unsubscribe();
    };
  }, [eventType]);
}

/**
 * Version of useEvent that only fires once
 */
export function useEventOnce<T extends EventType>(
  eventType: T, 
  callback: EventCallback<T>
) {
  // Subscribe to the event and clean up on unmount
  useEffect(() => {
    const unsubscribe = eventManager.once(eventType, callback);
    
    return () => {
      unsubscribe();
    };
  }, [eventType, callback]);
}

export default useEvent;
