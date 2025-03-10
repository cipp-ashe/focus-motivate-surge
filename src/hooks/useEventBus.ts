import { useEffect } from 'react';
import { eventManager, EventType, EventPayloads, EventHandler } from '@/lib/events/EventManager';

/**
 * DEPRECATED: Use the useEvent hook from @/hooks/useEvent instead
 * This hook exists only for backward compatibility
 */
export function useEventBus<T extends EventType>(
  eventName: T,
  callback: EventHandler<T>,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Log deprecation warning
    console.warn(
      "WARNING: useEventBus is deprecated. " +
      "Please update your code to use useEvent from @/hooks/useEvent instead."
    );
    
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventName, callback);
    
    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, [eventName, callback, ...deps]);
}
