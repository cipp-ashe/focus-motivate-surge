
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayload } from '@/lib/events/EventManager';

// DEPRECATED: Use useEvent from @/hooks/useEvent instead
// For backward compatibility
export function useEventBus<T extends EventType>(
  eventName: T,
  callback: (payload: EventPayload[T]) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventName, callback);
    
    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, [eventName, callback, ...deps]);
}
