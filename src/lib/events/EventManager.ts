import { v4 as uuidv4 } from 'uuid';

export type EventType = string;
export type EventPayload = any;
export type EventCallback<T = any> = (payload: T) => void;

/**
 * A simple event manager for handling custom events
 */
export class EventManager {
  private listeners: Map<EventType, { id: string; callback: EventCallback }[]> = new Map();
  private eventStore: { id: string; event_type: EventType; payload: EventPayload; timestamp: string }[] = [];
  private processedEventIds: Set<string> = new Set();
  
  /**
   * Subscribe to a specific event type
   * @param eventType The event type to subscribe to
   * @param callback The callback function to execute when the event is emitted
   * @returns An unsubscribe function to remove the subscription
   */
  on<T extends EventType>(eventType: T, callback: EventCallback<T>): () => void {
    const id = uuidv4();
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType)!.push({ id, callback });
    
    return () => {
      this.off(eventType, id);
    };
  }
  
  /**
   * Unsubscribe from a specific event type using the subscription id
   * @param eventType The event type to unsubscribe from
   * @param id The id of the subscription to remove
   */
  off(eventType: EventType, id: string): void {
    if (!this.listeners.has(eventType)) return;
    
    const listeners = this.listeners.get(eventType)!;
    this.listeners.set(eventType, listeners.filter(listener => listener.id !== id));
  }
  
  /**
   * Emit an event to all subscribed listeners
   * @param eventType The event type to emit
   * @param payload The event payload
   */
  emit<T extends EventType>(eventType: T, payload: any): void {
    // Store the event
    const eventId = uuidv4();
    this.storeEvent(eventId, eventType, payload);
    
    // Notify listeners
    if (!this.listeners.has(eventType)) return;
    
    const listeners = this.listeners.get(eventType)!;
    listeners.forEach(listener => {
      try {
        listener.callback(payload);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }
  
  /**
   * Store an event in the event store
   * @param id The unique ID of the event
   * @param eventType The event type
   * @param payload The event payload
   */
  private storeEvent(id: string, eventType: EventType, payload: EventPayload): void {
    const timestamp = new Date().toISOString();
    this.eventStore.push({ id, event_type: eventType, payload, timestamp });
    
    // Persist to localStorage
    this.persistEvents();
  }
  
  /**
   * Persist events to localStorage
   */
  private persistEvents(): void {
    localStorage.setItem('events', JSON.stringify(this.eventStore));
  }
  
  /**
   * Load events from localStorage
   */
  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.eventStore = JSON.parse(storedEvents);
    }
  }
  
  /**
   * Add an event to Supabase
   * @param eventType The event type
   * @param payload The event payload
   */
  async addEventToSupabase(eventType: EventType, payload: EventPayload): Promise<void> {
    // Implementation would go here
  }
  
  /**
   * Fetch unprocessed events from local storage
   */
  async fetchEvents(limit: number = 10): Promise<any[]> {
    this.loadEvents();
    
    // Filter out processed events
    const unprocessedEvents = this.eventStore.filter(event => !this.processedEventIds.has(event.id));
    
    // Limit the number of events to return
    return unprocessedEvents.slice(0, limit);
  }
  
  /**
   * Mark events as processed
   * @param eventIds The IDs of the events to mark as processed
   */
  async markEventsAsProcessed(eventIds: string[]): Promise<void> {
    eventIds.forEach(id => this.processedEventIds.add(id));
    
    // Remove processed events from local storage
    this.eventStore = this.eventStore.filter(event => !eventIds.includes(event.id));
    this.persistEvents();
  }
  
  /**
   * Clear all events from local storage
   */
  clearEvents(): void {
    this.eventStore = [];
    this.processedEventIds.clear();
    localStorage.removeItem('events');
  }
}

// Export a singleton instance
export const eventManager = new EventManager();

// Export types (but without EventType to avoid conflict)
export type { EventHandler, EventCallback, EventPayload };
