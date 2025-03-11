
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { TimerEventType, TimerEventPayloads } from '@/types/events';

/**
 * Hook to subscribe to a specific event and handle it
 * 
 * @param eventType - The event type to subscribe to
 * @param callback - The callback to run when the event is emitted
 */
export function useEvent<T extends TimerEventType>(
  eventType: T,
  callback: (payload: TimerEventPayloads[T]) => void
) {
  useEffect(() => {
    // Create a wrapper function that casts the payload to the correct type
    const wrappedCallback = (payload: any) => {
      callback(payload as TimerEventPayloads[T]);
    };
    
    // Subscribe to the event
    const unsubscribe = eventBus.on(eventType, wrappedCallback);
    
    // Return cleanup function
    return () => {
      unsubscribe();
    };
  }, [eventType, callback]);
}
