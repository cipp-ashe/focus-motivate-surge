
/**
 * @deprecated Use eventManager from @/lib/events/EventManager instead
 * This file is maintained for backward compatibility only and will be removed in a future version
 */

// Re-export the eventBus mock and other utilities
import { 
  eventBus, 
  trackEventBusUsage, 
  reportEventBusImport, 
  reportEventBusUsage 
} from '@/utils/eventBusToManagerMigration';

// When this file is imported, track the usage for debugging
trackEventBusUsage();

// Log stack trace to identify which component is importing this
console.warn(
  '%c[DEPRECATED] src/lib/eventBus.ts has been deprecated', 
  'color: red; font-weight: bold;',
  '\nStack trace:',
  new Error().stack
);

// Export the eventBus mock for backward compatibility
export { eventBus };

// Export the helper functions
export { trackEventBusUsage, reportEventBusImport, reportEventBusUsage };
