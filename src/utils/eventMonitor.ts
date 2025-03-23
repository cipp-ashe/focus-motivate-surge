import { eventManager } from '@/lib/events/EventManager';
import type { EventType, EventPayload } from '@/types/events';

// Simple event monitoring system for debugging
export const eventMonitor = {
  events: [] as Array<{ type: string; payload: any; timestamp: string }>,
  
  // Start monitoring events
  startMonitoring() {
    this.events = [];
    
    return eventManager.on('*', (data: { eventType: EventType; payload: any }) => {
      this.events.push({
        type: data.eventType,
        payload: data.payload,
        timestamp: new Date().toISOString()
      });
      
      // Keep only the most recent 100 events
      if (this.events.length > 100) {
        this.events.shift();
      }
    });
  },
  
  // Get all captured events
  getEvents() {
    return [...this.events];
  },
  
  // Filter events by type
  getEventsByType(type: string) {
    return this.events.filter(event => event.type === type);
  },
  
  // Clear captured events
  clearEvents() {
    this.events = [];
  }
};
