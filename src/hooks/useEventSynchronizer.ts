
import { useEffect, useRef } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { EventType } from '@/types/events';

interface EventMapping<T extends EventType, U extends EventType> {
  source: T;
  target: U;
  transform?: (payload: any) => any;
}

/**
 * Hook that synchronizes events by listening to source events and emitting target events
 * @param mappings Array of event mappings
 */
export function useEventSynchronizer<T extends EventType, U extends EventType>(
  mappings: EventMapping<T, U>[]
) {
  const mappingsRef = useRef(mappings);
  
  useEffect(() => {
    mappingsRef.current = mappings;
  }, [mappings]);
  
  useEffect(() => {
    const unsubscribers = mappingsRef.current.map(mapping => {
      return eventManager.on(mapping.source, (payload: any) => {
        const transformedPayload = mapping.transform ? 
          mapping.transform(payload) : 
          payload as any;
          
        eventManager.emit(mapping.target, transformedPayload);
      });
    });
    
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);
}

export default useEventSynchronizer;
