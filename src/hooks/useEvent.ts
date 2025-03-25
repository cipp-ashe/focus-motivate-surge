
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to subscribe to an application event
 * 
 * @param eventName The name of the event to subscribe to
 * @param callback The function to call when the event is emitted
 */
export const useEvent = (eventName: string, callback: (payload?: any) => void) => {
  useEffect(() => {
    // Subscribe to the event when the component mounts
    const unsubscribe = eventManager.on(eventName, callback);
    
    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [eventName, callback]);
};
