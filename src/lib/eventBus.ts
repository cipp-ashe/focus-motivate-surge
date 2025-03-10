
import { eventManager } from './events/EventManager';

// Re-export the eventManager as eventBus for backward compatibility
// DEPRECATED: Use eventManager directly from @/lib/events/EventManager instead
export const eventBus = eventManager;
