
import { eventManager } from '@/lib/events/EventManager';

/**
 * Temporary migration utility to help components transition from eventBus to eventManager
 * This should be removed after all components have been migrated
 */
export const eventBus = {
  emit: (event: any, payload: any) => {
    console.warn('DEPRECATED: eventBus.emit is deprecated, use eventManager.emit instead');
    // @ts-ignore - Force type compatibility until all components are migrated
    eventManager.emit(event, payload);
  },
  on: (event: any, callback: any) => {
    console.warn('DEPRECATED: eventBus.on is deprecated, use eventManager.on instead');
    // @ts-ignore - Force type compatibility until all components are migrated
    return eventManager.on(event, callback);
  },
  off: (event: any, callback: any) => {
    console.warn('DEPRECATED: eventBus.off is deprecated, use eventManager.off instead');
    // @ts-ignore - Force type compatibility until all components are migrated
    eventManager.off(event, callback);
  }
};
