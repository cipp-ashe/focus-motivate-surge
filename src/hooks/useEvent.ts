
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventCallback } from '@/types/events';

/**
 * Hook to subscribe to events with automatic cleanup
 */
export function useEvent<E extends EventType>(
  eventType: E,
  callback: EventCallback<E>
) {
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventType, callback);
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [eventType, callback]);
}
