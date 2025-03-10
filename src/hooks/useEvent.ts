
import { useEffect, useCallback } from 'react';
import { eventManager, EventType, EventPayload, EventHandler } from '@/lib/events/EventManager';

// Hook for subscribing to events
export function useEvent<T extends EventType>(
  eventType: T,
  handler: EventHandler<T>,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventManager.on(eventType, handler);
    
    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, [eventType, handler, ...deps]);
}

// Hook for emitting events
export function useEventEmitter() {
  const emit = useCallback(<T extends EventType>(eventType: T, payload: EventPayload[T]) => {
    eventManager.emit(eventType, payload);
  }, []);
  
  return { emit };
}

// Combined hook
export function useEvents<T extends EventType>(
  events: { [K in T]: EventHandler<K> },
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Subscribe to all events
    const unsubscribers = Object.entries(events).map(([eventType, handler]) => {
      return eventManager.on(eventType as T, handler as EventHandler<any>);
    });
    
    // Unsubscribe from all events when the component unmounts
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, deps);
  
  const emit = useCallback(<E extends EventType>(eventType: E, payload: EventPayload[E]) => {
    eventManager.emit(eventType, payload);
  }, []);
  
  return { emit };
}
