
import { eventManager } from './events/EventManager';

// Deprecation warning for the eventBus
console.warn(
  "WARNING: The eventBus import from '@/lib/eventBus' is deprecated. " +
  "Please update your code to use eventManager directly from '@/lib/events/EventManager' instead."
);

// Re-export the eventManager as eventBus for backward compatibility
// DEPRECATED: Use eventManager directly from @/lib/events/EventManager instead
export const eventBus = eventManager;
