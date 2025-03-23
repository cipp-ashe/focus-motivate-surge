
import { eventManager } from './EventManager';
import { EventType, EventHandler, EventPayloads } from '@/types/events';

/**
 * Registry for managing and prioritizing event handlers
 */
export class EventHandlerRegistry {
  private registry: Map<string, { handler: Function; priority: number }[]> = new Map();
  
  /**
   * Register a handler for a specific event type with a priority
   * Higher priority handlers are called first
   */
  register<T extends EventType>(
    eventType: T, 
    handler: EventHandler<EventPayloads[T]>, 
    priority: number = 0
  ): () => void {
    if (!this.registry.has(eventType)) {
      this.registry.set(eventType, []);
      
      // Set up the event listener in the event manager
      eventManager.on(eventType, (payload) => {
        this.handleEvent(eventType, payload);
      });
    }
    
    // Add the handler to the registry
    const handlers = this.registry.get(eventType)!;
    handlers.push({ handler, priority });
    
    // Sort handlers by priority (highest first)
    handlers.sort((a, b) => b.priority - a.priority);
    
    // Return unregister function
    return () => {
      this.unregister(eventType, handler);
    };
  }
  
  /**
   * Unregister a handler for a specific event type
   */
  unregister<T extends EventType>(eventType: T, handler: Function): void {
    if (!this.registry.has(eventType)) return;
    
    const handlers = this.registry.get(eventType)!;
    const index = handlers.findIndex(h => h.handler === handler);
    
    if (index !== -1) {
      handlers.splice(index, 1);
    }
    
    // If no handlers remain, remove the entry
    if (handlers.length === 0) {
      this.registry.delete(eventType);
    }
  }
  
  /**
   * Handle an event by calling all registered handlers in priority order
   */
  private handleEvent<T extends EventType>(eventType: T, payload: EventPayloads[T]): void {
    if (!this.registry.has(eventType)) return;
    
    const handlers = this.registry.get(eventType)!;
    
    // Call handlers in priority order
    for (const { handler } of handlers) {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
        // Continue with other handlers even if one fails
      }
    }
  }
}

// Create and export a singleton instance
export const eventHandlerRegistry = new EventHandlerRegistry();
