
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayloads } from '@/types/events';

/**
 * Hook to simplify adding event listeners to the event manager
 * 
 * @param eventName The name of the event to listen for
 * @param callback The callback function to execute when the event is emitted
 */
export function useEvent<T extends EventType>(eventName: T, callback: (data: EventPayloads[T]) => void) {
  useEffect(() => {
    // Register the event handler
    const unsubscribe = eventManager.on(eventName, callback);
    
    // Return cleanup function
    return () => {
      unsubscribe();
    };
  }, [eventName, callback]);
}
