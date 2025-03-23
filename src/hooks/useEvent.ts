
import { useEffect, useRef } from 'react';
import { eventManager, EventType } from '@/lib/events/EventManager';
import { EventPayloads } from '@/lib/events/types';

/**
 * Custom hook to subscribe to events using the EventManager
 * This hook automatically handles subscription cleanup and preserves the callback reference
 * 
 * @param eventType The event type to subscribe to
 * @param callback The callback function to execute when the event is emitted
 */
export function useEvent<T extends EventType>(
  eventType: T,
  callback: (payload: EventPayloads[T]) => void
) {
  // Use a ref to prevent unnecessary resubscriptions when the callback reference changes
  const callbackRef = useRef(callback);
  
  // Update the ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  useEffect(() => {
    // Create a stable wrapper that uses the current callback from the ref
    const stableCallback = (payload: any) => {
      callbackRef.current(payload);
    };
    
    // Subscribe to the event with our stable wrapper
    const unsubscribe = eventManager.on(eventType, stableCallback);
    
    // Return cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [eventType]); // Only depend on eventType changes, not callback
}
