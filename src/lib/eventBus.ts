
/**
 * eventBus compatibility layer
 * 
 * This provides backward compatibility with code that uses the old eventBus pattern
 * while forwarding all calls to the new eventManager.
 */

import { eventManager } from './events/EventManager';

// Map to track subscription unsubscribes
const subscriptionMap = new Map();

// Create a compatibility layer with the same API as the old eventBus
export const eventBus = {
  // Emit an event through the eventManager
  emit: (eventType: string, payload?: any) => {
    console.log(`eventBus: emitting ${eventType} through compatibility layer`);
    eventManager.emit(eventType as any, payload);
  },
  
  // Subscribe through the eventManager
  on: (eventType: string, callback: (payload: any) => void) => {
    console.log(`eventBus: subscribing to ${eventType} through compatibility layer`);
    const unsubscribe = eventManager.on(eventType as any, callback);
    
    // Store the unsubscribe function
    const key = `${eventType}:${callback.toString()}`;
    subscriptionMap.set(key, unsubscribe);
    
    // Return an unsubscribe function compatible with the old API
    return () => {
      subscriptionMap.delete(key);
      unsubscribe();
    };
  },
  
  // Remove a subscription
  off: (eventType: string, callback: (payload: any) => void) => {
    console.log(`eventBus: unsubscribing from ${eventType} through compatibility layer`);
    const key = `${eventType}:${callback.toString()}`;
    const unsubscribe = subscriptionMap.get(key);
    
    if (unsubscribe) {
      unsubscribe();
      subscriptionMap.delete(key);
    }
  },
  
  // Subscribe once through the eventManager
  once: (eventType: string, callback: (payload: any) => void) => {
    console.log(`eventBus: subscribing once to ${eventType} through compatibility layer`);
    return eventManager.once(eventType as any, callback);
  }
};
