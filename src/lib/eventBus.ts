
/**
 * Modern EventBus Implementation
 * 
 * This module provides a streamlined event bus system that uses the EventManager
 * internally. While we encourage direct use of EventManager in new code,
 * this compatibility layer exists to minimize changes to components 
 * that rely on the previous API.
 */

import { eventManager } from '@/lib/events/EventManager';
import { EventType } from '@/types/events';

// Forward all methods to the new event manager with more type safety
export const eventBus = {
  on<E extends EventType>(event: E, callback: (data: any) => void) {
    return eventManager.on(event, callback);
  },

  emit<E extends EventType>(event: E, data?: any) {
    return eventManager.emit(event, data);
  },

  once<E extends EventType>(event: E, callback: (data: any) => void) {
    return eventManager.once(event, callback);
  },

  off<E extends EventType>(event: E, callback?: (data: any) => void) {
    return eventManager.off(event, callback);
  }
};

export default eventBus;
