
type EventCallback = (payload: any) => void;

interface EventSubscription {
  eventName: string;
  callback: EventCallback;
}

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};
  private debounceTimeouts: Record<string, NodeJS.Timeout> = {};
  private lastEmitted: Record<string, number> = {};
  private debounceIntervals: Record<string, number> = {
    'habit:schedule': 300, // 300ms debounce for habit scheduling
    'habit:template-add': 500, // 500ms debounce for template addition
    'task:update': 200, // 200ms debounce for task updates
    'task:create': 200, // 200ms debounce for task creation
  };

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
    
    // For events that need debouncing (like habit:schedule)
    if (this.debounceIntervals[eventName]) {
      const now = Date.now();
      const debounceInterval = this.debounceIntervals[eventName];
      
      // Generate a unique key for debouncing if we have identifiable properties
      let debounceKey = eventName;
      
      // For habit scheduling, create a unique key based on habitId and date
      if (eventName === 'habit:schedule' && payload.habitId && payload.date) {
        debounceKey = `${eventName}-${payload.habitId}-${payload.date}`;
      }
      // For template addition, create a unique key based on templateId
      else if (eventName === 'habit:template-add' && payload.templateId) {
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

  public clear(): void {
    this.listeners = {};
    // Clear all debounce timeouts
    Object.values(this.debounceTimeouts).forEach(timeout => clearTimeout(timeout));
    this.debounceTimeouts = {};
    this.lastEmitted = {};
  }
}

export const eventBus = new EventBus();
