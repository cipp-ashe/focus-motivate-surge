
import { useEffect, useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';

/**
 * Hook to subscribe to events from the event bus with proper cleanup
 * @param eventType The event type to listen for
 * @param handler The handler function to be called when the event is fired
 */
export function useEvent<T = any>(
  eventType: string, 
  handler: (data: T) => void
) {
  // Create a stable reference to the handler to avoid unnecessary resubscriptions
  const stableHandler = useCallback(handler, [handler]);
  
  useEffect(() => {
    // Log the event subscription for debugging
    console.log(`[useEvent] Subscribing to ${eventType}`);
    
    // Subscribe to the event
    // Use type assertion to handle potential type mismatches
    const unsubscribe = eventBus.on(eventType as any, stableHandler);
    
    // Cleanup subscription on unmount
    return () => {
      console.log(`[useEvent] Unsubscribing from ${eventType}`);
      unsubscribe();
    };
  }, [eventType, stableHandler]);
}
