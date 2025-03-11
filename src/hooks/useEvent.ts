
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import type { EventType } from '@/lib/events/EventManager';

/**
 * Hook to subscribe to events from the event manager with proper cleanup
 * @param eventType The event type to listen for
 * @param handler The handler function to be called when the event is fired
 */
export function useEvent<T = any>(
  eventType: EventType, 
  handler: (data: T) => void
) {
  // Create a stable reference to the handler to avoid unnecessary resubscriptions
  const stableHandler = useCallback(handler, [handler]);
  
  useEffect(() => {
    console.log(`[useEvent] Subscribing to ${eventType}`);
    
    // Subscribe directly to eventManager instead of eventBus
    const unsubscribe = eventManager.on(eventType, stableHandler);
    
    // Cleanup subscription on unmount
    return () => {
      console.log(`[useEvent] Unsubscribing from ${eventType}`);
      unsubscribe();
    };
  }, [eventType, stableHandler]);
}
