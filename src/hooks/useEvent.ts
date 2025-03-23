
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';

// Define the EventType type locally if it's not exported from EventManager
export type EventType = string;

// Define a generic EventCallback type
export type EventCallback<E extends EventType> = (payload: any) => void;

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
