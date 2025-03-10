
import { eventManager } from './events/EventManager';

// Re-export the eventManager as eventBus for backward compatibility
export const eventBus = eventManager;
