
import { eventManager } from './EventManager';

/**
 * File to help with migration from eventBus to eventManager
 * This file tracks places where we're still using old patterns
 */

export function logMigrationIssue(component: string, method: string) {
  console.warn(
    `MIGRATION ISSUE: ${component} is still using ${method} instead of eventManager.`
  );
}

/**
 * Report a component importing the removed eventBus
 */
export function reportEventBusImport(component: string) {
  console.error(
    `EVENT SYSTEM ERROR: ${component} is trying to import the removed eventBus. Update to use eventManager.`
  );
  throw new Error(`eventBus has been removed. Use eventManager in ${component}`);
}

/**
 * Report a component using eventBus.on or eventBus.emit
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
      logMigrationIssue(componentName, 'on');
      return eventManager.on(args[0], args[1]);
    },
    emit: (...args: any[]) => {
      logMigrationIssue(componentName, 'emit');
      eventManager.emit(args[0], args[1]);
    }
  };
}
