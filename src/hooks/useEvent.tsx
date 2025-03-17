
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to subscribe to an event with a callback
 * Automatically unsubscribes when the component unmounts
 * 
 * @param eventName The name of the event to subscribe to
 * @param callback The callback to execute when the event is triggered
 */
export function useEvent<T = any>(eventName: string, callback: (data: T) => void) {
  useEffect(() => {
    // Register the event listener
    const unsubscribe = eventManager.on(eventName, callback);
    
    // Return cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [eventName, callback]);
}
