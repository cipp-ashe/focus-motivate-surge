
/**
 * MIGRATION UTILITY: This file exists only to assist with migration.
 * Import it in files that still depend on the old eventBus to get explicit errors,
 * then update those files to use eventManager instead.
 */
import { eventBus } from '@/utils/eventBusToManagerMigration';

// Export the compatibility layer for components still using eventBus
export { eventBus };

// Alert developers that this file should be imported from
console.warn('DEPRECATED: Importing from @/lib/eventBus.ts is deprecated. Import eventManager from @/lib/events/EventManager.ts instead.');
