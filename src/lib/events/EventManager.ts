
/**
 * Event Manager
 *
 * A centralized event system that allows components to communicate
 * without direct dependencies on each other.
 */

import { EventType, EventPayload, EventCallback, EventUnsubscribe } from '@/types/events';

class EventManager {
  private events: Map<string, EventCallback<any>[]> = new Map();
  private debugMode: boolean = false;

  /**
   * Enable or disable debug mode
   * @param enabled Whether debug mode should be enabled
   */
  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Subscribe to an event
   * @param eventName The name of the event to subscribe to
   * @param callback The function to call when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on<E extends EventType>(eventName: E, callback: EventCallback<E>): EventUnsubscribe {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback);

    if (this.debugMode) {
      console.log(`EventManager: Subscribed to ${eventName}, total listeners: ${callbacks.length}`);
    }

    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * Emit an event
   * @param eventName The name of the event to emit
   * @param payload The data to pass to the event callbacks
   */
  emit<E extends EventType>(eventName: E, payload?: EventPayload<E>): void {
    if (this.debugMode) {
      console.log(`EventManager: Emitting ${eventName}`, payload);
    }
    
    // Ensure unsubscribing during handling doesn't affect current emit
    const callbacks = [...(this.events.get(eventName) || [])];

    callbacks.forEach((callback) => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  /**
   * Unsubscribe from an event
   * @param eventName The name of the event to unsubscribe from
   * @param callback The callback to remove
   */
  off<E extends EventType>(eventName: E, callback: EventCallback<E>): void {
    const callbacks = this.events.get(eventName);
    if (!callbacks) return;

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
      
      if (this.debugMode) {
        console.log(`EventManager: Unsubscribed from ${eventName}, remaining listeners: ${callbacks.length}`);
      }
    }
  }

  /**
   * Subscribe to an event for a single trigger
   * @param eventName The name of the event to subscribe to
   * @param callback The function to call when the event is emitted
   * @returns A function to unsubscribe from the event if needed before it's triggered
   */
  once<E extends EventType>(eventName: E, callback: EventCallback<E>): EventUnsubscribe {
    const onceCallback: EventCallback<E> = (payload) => {
      this.off(eventName, onceCallback);
      callback(payload);
    };
    
    return this.on(eventName, onceCallback);
  }

  /**
   * Remove all event listeners
   */
  clear(): void {
    this.events.clear();
    
    if (this.debugMode) {
      console.log('EventManager: All event listeners cleared');
    }
  }

  /**
   * Get the number of listeners for an event
   * @param eventName The name of the event
   * @returns The number of listeners
   */
  listenerCount<E extends EventType>(eventName: E): number {
    return this.events.has(eventName) ? this.events.get(eventName)!.length : 0;
  }
}

// Create a singleton instance
export const eventManager = new EventManager();

// No need to export a useEvent hook here as it's already defined elsewhere
