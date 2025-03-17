
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
