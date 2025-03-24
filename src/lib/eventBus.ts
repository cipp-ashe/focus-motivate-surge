
import { EventManager } from './events/EventManager';

// Export the global event manager singleton instance
export const eventBus = EventManager.getInstance();

export default eventBus;
