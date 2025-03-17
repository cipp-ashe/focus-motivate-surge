
import { eventManager } from '@/lib/events/EventManager';
import { EventType, EventPayloads } from '@/lib/events/EventManager';

type EventRecord = {
  timestamp: number;
  eventType: string;
  payload: any;
};

/**
 * Tool for monitoring and debugging events
 */
export class EventMonitor {
  private isActive: boolean = false;
  private eventLog: EventRecord[] = [];
  private maxLogSize: number = 100;
  private unsubscribers: (() => void)[] = [];
  
  /**
   * Start monitoring events
   * @param maxLogSize Maximum number of events to keep in memory
   */
  start(maxLogSize: number = 100): void {
    if (this.isActive) return;
    
    this.isActive = true;
    this.maxLogSize = maxLogSize;
    this.eventLog = [];
    
    // Subscribe to all events using a wildcard approach
    const monitorEvent = <T extends EventType>(type: T, payload: EventPayloads[T]) => {
      this.recordEvent(type, payload);
    };
    
    // Task events
    // @ts-ignore - Custom event types 
    this.unsubscribers.push(eventManager.on('task:create', payload => monitorEvent('task:create', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('task:update', payload => monitorEvent('task:update', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('task:delete', payload => monitorEvent('task:delete', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('task:select', payload => monitorEvent('task:select', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('task:complete', payload => monitorEvent('task:complete', payload)));
    
    // Habit events
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('habit:schedule', payload => monitorEvent('habit:schedule', payload)));
    // @ts-ignore - Custom event types 
    this.unsubscribers.push(eventManager.on('habit:template-add', payload => monitorEvent('habit:template-add', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('habit:template-update', payload => monitorEvent('habit:template-update', payload)));
    // @ts-ignore - Custom event types
    this.unsubscribers.push(eventManager.on('habit:template-delete', payload => monitorEvent('habit:template-delete', payload)));
    
    // Timer events
    this.unsubscribers.push(eventManager.on('timer:start', payload => monitorEvent('timer:start', payload)));
    this.unsubscribers.push(eventManager.on('timer:complete', payload => monitorEvent('timer:complete', payload)));
    
    console.log('EventMonitor: Started monitoring events');
  }
  
  /**
   * Stop monitoring events
   */
  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Unsubscribe from all events
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
    
    console.log('EventMonitor: Stopped monitoring events');
  }
  
  /**
   * Record an event
   */
  private recordEvent<T extends EventType>(eventType: T, payload: EventPayloads[T]): void {
    this.eventLog.push({
      timestamp: Date.now(),
      eventType: eventType as string,
      payload: JSON.parse(JSON.stringify(payload)) // Deep clone to avoid reference issues
    });
    
    // Trim log if it exceeds max size
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize);
    }
  }
  
  /**
   * Get the event log
   */
  getLog(): EventRecord[] {
    return [...this.eventLog];
  }
  
  /**
   * Print the event log to console
   */
  printLog(): void {
    console.group('Event Monitor Log');
    console.log(`Total events: ${this.eventLog.length}`);
    
    this.eventLog.forEach((record, index) => {
      const time = new Date(record.timestamp).toISOString();
      console.groupCollapsed(`${index + 1}. ${time} - ${record.eventType}`);
      console.log('Payload:', record.payload);
      console.groupEnd();
    });
    
    console.groupEnd();
  }
  
  /**
   * Filter the log by event type
   */
  filterByEventType(eventType: EventType): EventRecord[] {
    return this.eventLog.filter(record => record.eventType === eventType);
  }
  
  /**
   * Clear the event log
   */
  clearLog(): void {
    this.eventLog = [];
    console.log('EventMonitor: Log cleared');
  }
}

// Create and export a singleton instance
export const eventMonitor = new EventMonitor();

// Helper function to toggle event monitoring from console
if (typeof window !== 'undefined') {
  (window as any).monitorEvents = (enable: boolean = true, maxLogSize: number = 100) => {
    if (enable) {
      eventMonitor.start(maxLogSize);
    } else {
      eventMonitor.stop();
    }
  };
  
  (window as any).printEventLog = () => {
    eventMonitor.printLog();
  };
  
  (window as any).clearEventLog = () => {
    eventMonitor.clearLog();
  };
  
  console.log('Event monitoring available. Use window.monitorEvents(), window.printEventLog(), window.clearEventLog()');
}
