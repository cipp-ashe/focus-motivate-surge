
import { eventManager } from './events/EventManager';

// Re-export the eventManager as eventBus for backward compatibility
// This file is deprecated and will be removed in future versions
console.warn(
  "WARNING: @/lib/eventBus is deprecated. " +
  "Please update your imports to use @/lib/events/EventManager directly."
);

export const eventBus = eventManager;
