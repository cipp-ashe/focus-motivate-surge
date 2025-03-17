
/**
 * Utility to help with migration from eventBus to eventManager
 * This file can be removed once migration is complete
 */

import { eventManager } from '@/lib/events/EventManager';

/**
 * Track eventBus usage to help with migration
 */
export function trackEventBusUsage() {
  const originalEmit = eventManager.emit;
  const trackedEvents = new Set<string>();
  
  // Override emit to track usage coming through eventBus
  eventManager.emit = function trackingEmit(event, payload) {
    // Check if the call is coming through eventBus (via stack trace)
    const stack = new Error().stack || '';
    const isEventBus = stack.includes('eventBus.ts');
    
    if (isEventBus && !trackedEvents.has(String(event))) {
      trackedEvents.add(String(event));
      console.warn(
        `MIGRATION NEEDED: eventBus.emit('${String(event)}') was called. ` +
        `Please update to use eventManager.emit('${String(event)}') directly. ` +
        `Stack trace: ${stack.split('\n').slice(2, 5).join('\n')}`
      );
    }
    
    // Call the original method
    return originalEmit.call(this, event, payload);
  };
}
