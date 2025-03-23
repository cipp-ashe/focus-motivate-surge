
import { EventType, EventPayload, EventCallback } from '@/types/events';

interface EventSubscription {
  callback: Function;
  once: boolean;
}

type EventMap = Record<string, EventSubscription[]>;

/**
 * Centralized event management system that replaces the older eventBus pattern
 */
class EventManager {
  private events: EventMap = {};
  private debugMode = false;
  private readonly eventHistory: Array<{type: string, payload: any, timestamp: number}> = [];
  private readonly MAX_HISTORY = 100;

  /**
   * Subscribe to an event
   * @param eventType The event to subscribe to
   * @param callback The callback function to be executed when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on<T extends EventType>(eventType: T, callback: EventCallback<T>): () => void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }

    const subscription: EventSubscription = {
      callback: callback as Function,
      once: false
    };

    this.events[eventType].push(subscription);

    // Return unsubscribe function
    return () => {
      this.off(eventType, callback as Function);
    };
  }

  /**
   * Subscribe to an event, but only trigger once
   * @param eventType The event to subscribe to
   * @param callback The callback function to be executed when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  once<T extends EventType>(eventType: T, callback: EventCallback<T>): () => void {
    if (!this.events[eventType]) {
      this.events[eventType] = [];
    }

    const subscription: EventSubscription = {
      callback: callback as Function,
      once: true
    };

    this.events[eventType].push(subscription);

    // Return unsubscribe function
    return () => {
      this.off(eventType, callback as Function);
    };
  }

  /**
   * Unsubscribe from an event
   * @param eventType The event to unsubscribe from
   * @param callback The callback function to remove
   */
  off<T extends EventType>(eventType: T, callback: EventCallback<T>): void {
    if (!this.events[eventType]) {
      return;
    }

    this.events[eventType] = this.events[eventType].filter(
      subscription => subscription.callback !== callback
    );
  }

  /**
   * Emit an event
   * @param eventType The event to emit
   * @param payload The data to send with the event
   */
  emit<T extends EventType>(eventType: T, payload: EventPayload<T>): void {
    // Log event to console in debug mode
    if (this.debugMode) {
      console.log(`%c[EventManager] ${eventType}`, 'color: #8c54de', payload);
    }

    // Add to history
    this.trackEvent(eventType, payload);

    // Execute callbacks for specific event
    if (this.events[eventType]) {
      this.executeCallbacks(eventType, payload);
    }

    // Execute callbacks for wildcard event
    if (eventType !== '*' && this.events['*']) {
      this.executeCallbacks('*', { type: eventType, payload });
    }
  }

  /**
   * Execute callbacks for an event
   * @param eventType The event type
   * @param payload The event payload
   */
  private executeCallbacks(eventType: string, payload: any): void {
    // Create a copy to avoid issues if callbacks modify the array
    const subscriptions = [...this.events[eventType]];

    subscriptions.forEach(subscription => {
      try {
        subscription.callback(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });

    // Remove 'once' subscriptions
    this.events[eventType] = this.events[eventType].filter(
      subscription => !subscription.once
    );
  }

  /**
   * Enable or disable debug mode
   * @param enabled Whether debug mode should be enabled
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Track an event in the history
   * @param type The event type
   * @param payload The event payload
   */
  private trackEvent(type: string, payload: any): void {
    this.eventHistory.unshift({ 
      type, 
      payload, 
      timestamp: Date.now() 
    });
    
    // Limit history size
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.pop();
    }
  }

  /**
   * Get the event history
   * @returns Array of recorded events
   */
  getEventHistory(): Array<{type: string, payload: any, timestamp: number}> {
    return [...this.eventHistory];
  }

  /**
   * Get a count of listeners for each event type
   * @returns Record of event types and their listener counts
   */
  getListenerCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    Object.keys(this.events).forEach(eventType => {
      counts[eventType] = this.events[eventType].length;
    });
    
    return counts;
  }

  /**
   * Clear all event subscriptions
   */
  clearAllSubscriptions(): void {
    this.events = {};
  }
}

// Export a singleton instance
export const eventManager = new EventManager();

// Export the EventManager class for testing
export { EventManager };
