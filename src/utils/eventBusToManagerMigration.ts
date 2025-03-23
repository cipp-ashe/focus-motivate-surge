
import { eventManager } from '@/lib/events/EventManager';

/**
 * Migration utility to help identify components that need to be updated
 * This file provides a compatibility layer for transitioning from eventBus to eventManager
 */

/**
 * Track deprecated event usage patterns
 */
export function trackEventBusUsage() {
  console.warn(
    "%c[DEPRECATED] eventBus has been removed", 
    "color: red; font-weight: bold; background-color: yellow; padding: 2px 5px;",
    "\nAll components must use eventManager directly."
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
    `%c[ERROR] ${component} is importing the removed eventBus`, 
    "color: white; font-weight: bold; background-color: red; padding: 2px 5px;",
    "\nUpdate to use eventManager from @/lib/events/EventManager"
  );
  throw new Error(`eventBus has been removed. Use eventManager in ${component}`);
}

/**
 * Report components using eventBus methods
 */
export function reportEventBusUsage(component: string, method: string) {
  console.error(
    `%c[ERROR] ${component} using removed eventBus.${method}()`, 
    "color: white; font-weight: bold; background-color: red; padding: 2px 5px;",
    "\nUpdate to use eventManager from @/lib/events/EventManager"
  );
  throw new Error(`eventBus has been removed. Use eventManager.${method} in ${component}`);
}

/**
 * Create a helper for component migration that logs usage
 */
export function createMigrationHelper(componentName: string) {
  return {
    on: (...args: any[]) => {
      console.warn(
        `%c[DEPRECATED] ${componentName} using migration helper instead of eventManager.on`, 
        "color: orange; font-weight: bold;",
        "\nUpdate to import and use eventManager directly."
      );
      return eventManager.on(args[0], args[1]);
    },
    emit: (...args: any[]) => {
      console.warn(
        `%c[DEPRECATED] ${componentName} using migration helper instead of eventManager.emit`, 
        "color: orange; font-weight: bold;",
        "\nUpdate to import and use eventManager directly."
      );
      eventManager.emit(args[0], args[1]);
    },
    off: (...args: any[]) => {
      console.warn(
        `%c[DEPRECATED] ${componentName} using migration helper instead of eventManager.off`, 
        "color: orange; font-weight: bold;",
        "\nUpdate to import and use eventManager directly."
      );
      eventManager.off(args[0], args[1]);
    }
  };
}

/**
 * Mock version of eventBus that redirects to eventManager with warnings
 * This is for backward compatibility and should be removed in future
 */
export const eventBus = {
  on: (event: any, callback: any) => {
    console.warn(
      '%c[DEPRECATED] eventBus.on is deprecated', 
      'color: orange; font-weight: bold;',
      '\nUse eventManager.on instead. Stack trace:',
      new Error().stack
    );
    return eventManager.on(event, callback);
  },
  emit: (event: any, payload: any) => {
    console.warn(
      '%c[DEPRECATED] eventBus.emit is deprecated', 
      'color: orange; font-weight: bold;',
      '\nUse eventManager.emit instead. Stack trace:',
      new Error().stack
    );
    eventManager.emit(event, payload);
  },
  off: (event: any, callback: any) => {
    console.warn(
      '%c[DEPRECATED] eventBus.off is deprecated', 
      'color: orange; font-weight: bold;',
      '\nUse eventManager.off instead. Stack trace:',
      new Error().stack
    );
    eventManager.off(event, callback);
  }
};
