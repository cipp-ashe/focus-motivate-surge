
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayloads } from '@/types/events';

/**
 * Utility to monitor and log events
 */
export const eventMonitor = () => {
  // Log all events
  const logAllEvents = (payload: { type: EventType; payload: any }) => {
    console.log('Event triggered:', payload);
    toast.info(`Event triggered: ${JSON.stringify(payload)}`);
  };

  // Subscribe to all events
  eventManager.on('*', logAllEvents);

  return {
    logAllEvents
  };
};
