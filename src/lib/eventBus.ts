
import { eventManager } from './events/EventManager';

// Re-export the eventManager as eventBus for backward compatibility
// This file is deprecated and will be removed in future versions
console.warn(
  "WARNING: @/lib/eventBus is deprecated. " +
  "Please update your imports to use @/lib/events/EventManager directly."
);

// Create a proxy to forward all calls to eventManager
export const eventBus = new Proxy(eventManager, {
  get(target, prop) {
    // Forward all property accesses to the target
    return target[prop];
  }
});

// Re-export types for backward compatibility
export type { 
  EventType, 
  EventHandler,
  EventPayloads 
} from './events/EventManager';
