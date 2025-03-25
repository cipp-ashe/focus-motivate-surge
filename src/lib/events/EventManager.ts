
/**
 * Event Manager
 * 
 * A simple event system that allows components to communicate
 * without direct dependencies on each other.
 */

type EventCallback = (payload?: any) => void;

class EventManager {
  private events: Map<string, EventCallback[]> = new Map();
  
  /**
   * Subscribe to an event
   * @param eventName The name of the event to subscribe to
   * @param callback The function to call when the event is emitted
   * @returns A function to unsubscribe from the event
   */
  on(eventName: string, callback: EventCallback): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback);
    
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Emit an event
   * @param eventName The name of the event to emit
   * @param payload The data to pass to the event callbacks
   */
  emit(eventName: string, payload?: any): void {
    // Ensure unsubscribing during handling doesn't affect current emit
    const callbacks = [...(this.events.get(eventName) || [])];
    
    callbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }
  
  /**
   * Remove all event listeners
   */
  clear(): void {
    this.events.clear();
  }
  
  /**
   * Get the number of listeners for an event
   */
  listenerCount(eventName: string): number {
    return this.events.has(eventName) ? this.events.get(eventName)!.length : 0;
  }
}

// Create a singleton instance
export const eventManager = new EventManager();

// Define a hook for React components
export const useEvent = () => eventManager;
