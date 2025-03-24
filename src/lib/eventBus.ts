
/**
 * LEGACY EVENT BUS - For backwards compatibility only
 * 
 * This is a legacy module that forwards to the new EventManager system.
 * Use the EventManager directly in new code.
 */

import { eventManager } from '@/lib/events/EventManager';
import { deprecate } from '@/utils/deprecation';

const warnDeprecated = (method: string) => {
  deprecate('eventBus', method, 'Use eventManager from @/lib/events/EventManager instead');
};

// Forward all methods to the new event manager
export const eventBus = {
  on(event: string, callback: (data: any) => void) {
    warnDeprecated('on');
    return eventManager.on(event as any, callback);
  },

  emit(event: string, data?: any) {
    warnDeprecated('emit');
    return eventManager.emit(event as any, data);
  },

  once(event: string, callback: (data: any) => void) {
    warnDeprecated('once');
    return eventManager.once(event as any, callback);
  },

  off(event: string, callback?: (data: any) => void) {
    warnDeprecated('off');
    return eventManager.off(event as any, callback);
  }
};

export default eventBus;
