
/**
 * Migration utility to help identify components that need to be updated
 * This file can be removed once migration is complete
 */

import { eventManager } from '@/lib/events/EventManager';
import { logMigrationIssue, reportEventBusImport } from '@/lib/events/migrationUtils';

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

/**
 * Mock version of eventBus that throws errors for any component still trying to use it
 */
export const eventBus = {
  on: (eventName: string, callback: Function) => {
    reportEventBusImport('Unknown component');
    return () => {};
  },
  emit: (eventName: string, data: any) => {
    reportEventBusImport('Unknown component');
  },
  off: (eventName: string, callback: Function) => {
    reportEventBusImport('Unknown component');
  }
};
