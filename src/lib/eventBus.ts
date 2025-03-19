
/**
 * @deprecated Use eventManager from @/lib/events/EventManager instead
 * This file is maintained for backward compatibility only
 */

// Re-export the eventBus mock and other utilities
import { eventBus, trackEventBusUsage, reportEventBusImport, reportEventBusUsage } from '@/utils/eventBusToManagerMigration';

// When this file is imported, track the usage for debugging
trackEventBusUsage();

// Export the eventBus mock for backward compatibility
export { eventBus };

// Export the helper functions
export { trackEventBusUsage, reportEventBusImport, reportEventBusUsage };
