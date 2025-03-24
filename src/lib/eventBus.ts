
import { EventManager } from './events/EventManager';

// Re-export the global event manager as eventBus for backward compatibility
export const eventBus = EventManager.getInstance();

export default eventBus;
