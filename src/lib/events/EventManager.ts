
import { EventType, EventCallback, EventPayloads, EventUnsubscribe } from '@/types/events';

/**
 * EventManager singleton class
 * Provides a centralized event system for the application
 */
class EventManager {
  private listeners: Map<EventType, Set<EventCallback<any>>> = new Map();
  private onceListeners: Map<EventType, Set<EventCallback<any>>> = new Map();
  private eventHistory: Map<EventType, any[]> = new Map();
  private readonly historyLimit = 10;

  /**
   * Subscribe to an event
   * @param eventType Event to subscribe to
   * @param callback Function to call when the event is emitted
   * @returns Function to unsubscribe from the event
   */
  on<T extends EventType>(eventType: T, callback: EventCallback<T>): EventUnsubscribe {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    const listeners = this.listeners.get(eventType)!;
    listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    };
  }

  /**
   * Subscribe to an event, but only receive it once
   * @param eventType Event to subscribe to
   * @param callback Function to call when the event is emitted
   * @returns Function to unsubscribe from the event
   */
  once<T extends EventType>(eventType: T, callback: EventCallback<T>): EventUnsubscribe {
    if (!this.onceListeners.has(eventType)) {
      this.onceListeners.set(eventType, new Set());
    }
    
    const listeners = this.onceListeners.get(eventType)!;
    listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.onceListeners.delete(eventType);
      }
    };
  }

  /**
   * Emit an event with optional payload
   * @param eventType Event to emit
   * @param payload Data to pass to event listeners
   */
  emit<T extends EventType>(eventType: T, payload: EventPayloads[T]): void {
    console.log(`EventManager: Emitting ${eventType}`, payload);
    
    // Add to history
    if (!this.eventHistory.has(eventType)) {
      this.eventHistory.set(eventType, []);
    }
    
    const history = this.eventHistory.get(eventType)!;
    history.push(payload);
    
    // Limit history size
    if (history.length > this.historyLimit) {
      history.shift();
    }
    
    // Call normal listeners
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
    
    // Call once listeners and then remove them
    const onceListeners = this.onceListeners.get(eventType);
    if (onceListeners && onceListeners.size > 0) {
      const listenersArray = Array.from(onceListeners);
      this.onceListeners.delete(eventType);
      
      listenersArray.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in once event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Get the most recent event payload for a specific event type
   * @param eventType Event type to get history for
   * @returns Most recent event payload or null if no history exists
   */
  getLastEvent<T extends EventType>(eventType: T): EventPayloads[T] | null {
    const history = this.eventHistory.get(eventType);
    if (!history || history.length === 0) return null;
    return history[history.length - 1];
  }

  /**
   * Get the event history for a specific event type
   * @param eventType Event type to get history for
   * @returns Array of event payloads or empty array if no history exists
   */
  getEventHistory<T extends EventType>(eventType: T): EventPayloads[T][] {
    return this.eventHistory.get(eventType) || [];
  }

  /**
   * Remove all listeners for a specific event type
   * @param eventType Event type to clear listeners for
   */
  clearListeners(eventType: EventType): void {
    this.listeners.delete(eventType);
    this.onceListeners.delete(eventType);
  }

  /**
   * Remove all listeners for all event types
   */
  clearAllListeners(): void {
    this.listeners.clear();
    this.onceListeners.clear();
  }
}

// Export a singleton instance
export const eventManager = new EventManager();
