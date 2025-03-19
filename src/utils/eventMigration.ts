
import { eventManager } from '@/lib/events/EventManager';

/**
 * Migration utility to help identify components that need to be updated
 * This file can be removed once migration is complete
 */

/**
 * Track deprecated event usage patterns
 */
export function trackEventBusUsage() {
  console.warn(
    "EVENT SYSTEM MIGRATION: eventBus has been completely removed. " +
    "All components must use eventManager directly."
  );
  
  // Log all the currently registered event handlers to help identify migration needs
  const counts = eventManager.getListenerCounts();
  console.log("Current eventManager listeners:", counts);
}

/**
 * Report components importing the removed eventBus
 */
export function reportEventBusImport(component: string) {
  console.error(
    `EVENT SYSTEM ERROR: ${component} is trying to import the removed eventBus. Update to use eventManager.`
  );
  throw new Error(`eventBus has been removed. Use eventManager in ${component}`);
}

/**
 * Report components using eventBus methods
 */
export function reportEventBusUsage(component: string, method: string) {
  console.error(
    `EVENT SYSTEM ERROR: ${component} is trying to use ${method} from the removed eventBus. Update to use eventManager.`
  );
  throw new Error(`eventBus has been removed. Use eventManager.${method} in ${component}`);
}

/**
 * Create a helper for component migration
 */
export function createMigrationHelper(componentName: string) {
  return {
    on: (...args: any[]) => {
      console.warn(`MIGRATION ISSUE: ${componentName} is still using on instead of eventManager.on`);
      return eventManager.on(args[0], args[1]);
    },
    emit: (...args: any[]) => {
      console.warn(`MIGRATION ISSUE: ${componentName} is still using emit instead of eventManager.emit`);
      eventManager.emit(args[0], args[1]);
    }
  };
}

/**
 * Mock version of eventBus that redirects to eventManager
 * This is for backward compatibility and should be removed in future
 */
export const eventBus = {
  on: (event: any, callback: any) => {
    console.warn('DEPRECATED: eventBus.on is deprecated, use eventManager.on instead');
    return eventManager.on(event, callback);
  },
  emit: (event: any, payload: any) => {
    console.warn('DEPRECATED: eventBus.emit is deprecated, use eventManager.emit instead');
    eventManager.emit(event, payload);
  },
  off: (event: any, callback: any) => {
    console.warn('DEPRECATED: eventBus.off is deprecated, use eventManager.off instead');
    eventManager.off(event, callback);
  }
};
