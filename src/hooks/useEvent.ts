
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventCallback } from '@/types/events';

/**
 * Hook for subscribing to events
 * 
 * This hook provides a simple way to subscribe to events and automatically
 * unsubscribes when the component unmounts.
 * 
 * @param eventType The type of event to subscribe to
 * @param callback The function to call when the event is emitted
 */
export function useEvent<T extends EventType>(
  eventType: T,
  callback: EventCallback<T>
) {
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventType, callback);
    
    // Return cleanup function that unsubscribes
    return unsubscribe;
  }, [eventType, callback]);
}
