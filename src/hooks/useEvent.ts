
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to simplify adding event listeners to the event manager
 * 
 * @param eventName The name of the event to listen for
 * @param callback The callback function to execute when the event is emitted
 */
export function useEvent<T = any>(eventName: string, callback: (data: T) => void) {
  useEffect(() => {
    // Register the event handler
    // @ts-ignore - We're allowing string event names for flexibility
    const unsubscribe = eventManager.on(eventName as any, callback as any);
    
    // Return cleanup function
    return () => {
      // @ts-ignore - We're allowing string event names for flexibility
      eventManager.off(eventName as any, callback as any);
    };
  }, [eventName, callback]);
}
