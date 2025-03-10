
import { useEffect } from 'react';
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
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventBus.on(eventType, handler);
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [eventType, handler]);
}
