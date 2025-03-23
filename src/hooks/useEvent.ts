
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventCallback } from '@/types/events';

/**
 * Hook to subscribe to events with automatic cleanup
 */
export function useEvent<E extends string>(
  eventType: E,
  callback: EventCallback<E extends EventType ? E : never>
) {
  useEffect(() => {
    // Cast eventType to EventType to satisfy TypeScript
    const unsubscribe = eventManager.on(eventType as EventType, callback as any);
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [eventType, callback]);
}
