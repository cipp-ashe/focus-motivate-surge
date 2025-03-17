
/**
 * Migration utility to help identify components that need to be updated
 * This file can be removed once migration is complete
 */

import { eventManager } from '@/lib/events/EventManager';

/**
 * Track deprecated event usage patterns
 */
export function trackEventBusUsage() {
  console.warn(
    "EVENT SYSTEM MIGRATION: eventBus has been completely removed. " +
    "All components must use eventManager directly."
  );
  
  // We can't track eventBus anymore since it's removed
  // Instead, we'll check for potential migration issues in other ways
  
  // Log all the currently registered event handlers to help identify migration needs
  const counts = eventManager.getListenerCounts();
  console.log("Current eventManager listeners:", counts);
}
