
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to simplify adding event listeners to the event manager
 * 
 * @param eventName The name of the event to listen for
 * @param callback The callback function to execute when the event is emitted
 */
export function useEvent(eventName: string, callback: (...args: any[]) => void) {
  useEffect(() => {
    // Register the event handler
    eventManager.on(eventName, callback);
    
    // Return cleanup function
    return () => {
      eventManager.off(eventName, callback);
    };
  }, [eventName, callback]);
}
