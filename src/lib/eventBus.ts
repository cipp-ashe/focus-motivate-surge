
/**
 * @deprecated - Use eventManager from '@/lib/events/EventManager' instead
 * 
 * This file is kept temporarily to prevent breaking changes during refactoring.
 * All new code should use the EventManager directly.
 */

import { eventManager } from './events/EventManager';
import { EventType } from '@/types/events';

console.warn('eventBus is deprecated. Use eventManager from @/lib/events/EventManager instead');

// Re-export the eventManager with the eventBus interface
export const eventBus = eventManager;

// Export for backward compatibility
export default eventManager;
