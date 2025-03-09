
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { TimerEventType, TimerEventPayloads } from '@/types/events';

export function useEventBus<T extends TimerEventType>(
  eventName: T,
  callback: (payload: TimerEventPayloads[T]) => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventBus.on(eventName, callback);
    
    // Unsubscribe when the component unmounts
    return unsubscribe;
  }, [eventName, callback, ...deps]);
}
