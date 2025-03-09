
type EventCallback = (payload: any) => void;

interface EventSubscription {
  eventName: string;
  callback: EventCallback;
}

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};
  private debounceTimeouts: Record<string, NodeJS.Timeout> = {};
  private lastEmitted: Record<string, number> = {};
  private pendingEvents: Record<string, any> = {};
  private debounceIntervals: Record<string, number> = {
    'habit:schedule': 300, // 300ms debounce for habit scheduling
    'habit:template-add': 500, // 500ms debounce for template addition
    'task:update': 200, // 200ms debounce for task updates
    'task:create': 200, // 200ms debounce for task creation
    'habits:processed': 300, // 300ms debounce for habits processed events
    'habits:check-pending': 100, // 100ms debounce for habit checking
  };

  constructor() {
    // Set up listeners for page navigation
    window.addEventListener('popstate', () => {
      console.log('[EventBus] Page navigation detected, processing pending events');
      this.processPendingEvents();
    });
    
    // Also process pending events regularly
    setInterval(() => {
      this.processPendingEvents();
    }, 5000); // Check every 5 seconds
  }

  public on(eventName: string, callback: EventCallback): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    
    this.listeners[eventName].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.off(eventName, callback);
    };
  }

  // Add the off method to remove specific event listeners
  public off(eventName: string, callback: EventCallback): void {
    if (!this.listeners[eventName]) return;
    
    this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    
    // Clean up the event entirely if no listeners remain
    if (this.listeners[eventName].length === 0) {
      delete this.listeners[eventName];
    }
  }

  public emit(eventName: string, payload: any = {}): void {
    console.log(`[EventBus] ${eventName}`, payload);
    
    // Always store events that might need to be reprocessed on page navigation
    if (['habit:schedule', 'habit:template-add', 'habit:template-update'].includes(eventName)) {
      this.storePendingEvent(eventName, payload);
    }
    
    // For habit:schedule, always process immediately regardless of debounce settings
    // This is critical to ensure tasks are created reliably
    if (eventName === 'habit:schedule') {
      this.executeEvent(eventName, payload);
      return;
    }
    
    // For events that need debouncing
    if (this.debounceIntervals[eventName]) {
      const now = Date.now();
      const debounceInterval = this.debounceIntervals[eventName];
      
      // Generate a unique key for debouncing if we have identifiable properties
      let debounceKey = eventName;
      
      // For template addition, create a unique key based on templateId
      if (eventName === 'habit:template-add' && payload.templateId) {
        debounceKey = `${eventName}-${payload.templateId}`;
      }
      // For task operations, create a unique key based on taskId
      else if ((eventName === 'task:update' || eventName === 'task:create') && payload.taskId) {
        debounceKey = `${eventName}-${payload.taskId}`;
      }
      
      // Check if we've emitted this event recently
      if (this.lastEmitted[debounceKey] && (now - this.lastEmitted[debounceKey] < debounceInterval)) {
        console.log(`[EventBus] Debouncing ${eventName} with ID ${debounceKey}, last emitted ${now - this.lastEmitted[debounceKey]}ms ago`);
        
        // Clear existing timeout
        if (this.debounceTimeouts[debounceKey]) {
          clearTimeout(this.debounceTimeouts[debounceKey]);
        }
        
        // Set new timeout
        this.debounceTimeouts[debounceKey] = setTimeout(() => {
          this.executeEvent(eventName, payload);
          delete this.debounceTimeouts[debounceKey];
          this.lastEmitted[debounceKey] = Date.now();
        }, debounceInterval);
        
        return;
      }
      
      // Update last emitted time
      this.lastEmitted[debounceKey] = now;
    }
    
    // For non-debounced events or the first emission of a debounced event
    this.executeEvent(eventName, payload);
  }

  private executeEvent(eventName: string, payload: any): void {
    if (!this.listeners[eventName]) return;
    
    const callbacks = [...this.listeners[eventName]]; // Create a copy to avoid issues if callbacks modify the listeners
    callbacks.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  // Store events that might need to be reprocessed on page navigation
  private storePendingEvent(eventName: string, payload: any): void {
    // For certain events, store them to potentially replay later
    const storageKey = `${eventName}-${Date.now()}`;
    this.pendingEvents[storageKey] = {
      eventName,
      payload,
      timestamp: Date.now()
    };
    
    // Limit the number of pending events
    const keys = Object.keys(this.pendingEvents);
    if (keys.length > 100) {
      // Remove oldest events if we have too many
      const oldestKey = keys.sort((a, b) => 
        this.pendingEvents[a].timestamp - this.pendingEvents[b].timestamp
      )[0];
      delete this.pendingEvents[oldestKey];
    }
  }

  // Process any pending events, typically after page navigation
  private processPendingEvents(): void {
    const now = Date.now();
    let count = 0;
    
    // Get all pending events less than 1 minute old
    const recentEvents = Object.entries(this.pendingEvents)
      .filter(([_, event]) => (now - event.timestamp) < 60000) // Less than 1 minute old
      .map(([key, event]) => ({ key, ...event }));
    
    if (recentEvents.length > 0) {
      console.log(`[EventBus] Processing ${recentEvents.length} pending events after navigation`);
      
      // Process events
      recentEvents.forEach(event => {
        // Only process certain event types that are likely to need replaying
        if (event.eventName === 'habit:schedule') {
          console.log(`[EventBus] Reprocessing pending event ${event.eventName}`, event.payload);
          this.executeEvent(event.eventName, event.payload);
          count++;
        }
        
        // Remove from pending events
        delete this.pendingEvents[event.key];
      });
      
      // Force task update if we processed any events
      if (count > 0) {
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
          window.dispatchEvent(new Event('force-tags-update'));
        }, 200);
      }
    }
  }

  public clear(): void {
    this.listeners = {};
    // Clear all debounce timeouts
    Object.values(this.debounceTimeouts).forEach(timeout => clearTimeout(timeout));
    this.debounceTimeouts = {};
    this.lastEmitted = {};
    this.pendingEvents = {};
  }
}

export const eventBus = new EventBus();
