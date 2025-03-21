
import { supabase } from '@/lib/supabase/client';
import { AllEventTypes, EventPayloads } from '@/lib/events/types';

export type EventType = AllEventTypes;
export type EventHandler<T extends EventType> = (payload: EventPayloads[T]) => void;

type EventCallback<T = any> = (payload: T) => void;
interface EventSubscription {
  unsubscribe: () => void;
}

// Implement log throttling for persistence messages
const createThrottledLogger = () => {
  const lastLogTime: Record<string, number> = {};
  const logIntervals: Record<string, number> = {
    'auth': 5000, // Only log auth messages every 5 seconds
  };

  return (message: string, category: string = 'default') => {
    const now = Date.now();
    const interval = logIntervals[category] || 1000;
    
    if (!lastLogTime[message] || (now - lastLogTime[message]) > interval) {
      console.log(message);
      lastLogTime[message] = now;
      return true;
    }
    return false;
  };
};

const throttledLog = createThrottledLogger();

class EventManager {
  private listeners: Record<string, EventCallback[]>;
  
  constructor() {
    this.listeners = {};
  }

  /**
   * Subscribe to an event
   */
  on<T extends EventType>(event: T, callback: EventHandler<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(callback as EventCallback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off<T extends EventType>(event: T, callback: EventHandler<T>): void {
    if (!this.listeners[event]) return;
    
    const index = this.listeners[event].indexOf(callback as EventCallback);
    if (index !== -1) {
      this.listeners[event].splice(index, 1);
    }
  }

  /**
   * Emit an event
   */
  emit<T extends EventType>(event: T, payload: EventPayloads[T]): void {
    // Only log non-frequent events to reduce noise
    const nonFrequentEvents = [
      'task:create', 'task:delete', 'habit:template-update',
      'auth:signed-in', 'auth:signed-out', 'app:initialized'
    ];
    
    if (nonFrequentEvents.includes(event)) {
      console.log(`Emitting event: ${event}`, payload);
    }
    
    // Call local listeners
    if (this.listeners[event]) {
      for (const callback of this.listeners[event]) {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
    
    // Persist to Supabase if user is authenticated
    this.persistEventToSupabase(event, payload);
  }

  /**
   * For testing: Get listener counts
   */
  getListenerCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const event in this.listeners) {
      counts[event] = this.listeners[event].length;
    }
    return counts;
  }

  /**
   * For testing: Clear all event listeners
   */
  clear(): void {
    this.listeners = {};
  }

  /**
   * Persist event to Supabase for cross-device synchronization
   */
  private async persistEventToSupabase<T extends EventType>(event: T, payload: EventPayloads[T]): Promise<void> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Use throttled logging to reduce duplicate messages
        throttledLog('User not authenticated, skipping event persistence', 'auth');
        return;
      }
      
      // Skip persistence for certain events to prevent loops
      const skipPersistenceEvents = [
        'timer:tick',
        'timer:state-update',
        'app:initialization-complete',
        'app:initialized',
        'page:timer-ready',
        'nav:route-change'
      ];
      
      if (skipPersistenceEvents.includes(event)) {
        return;
      }
      
      // Insert event into Supabase
      const { error } = await supabase.from('events').insert({
        user_id: user.id,
        event_type: event,
        payload,
        processed: false
      });
      
      if (error) {
        console.error('Error persisting event to Supabase:', error);
      }
    } catch (error) {
      console.error('Error in persistEventToSupabase:', error);
    }
  }

  /**
   * Fetch unprocessed events for current user
   */
  async fetchEvents(limit: number = 10): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('processed', false)
        .order('created_at', { ascending: true })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      return [];
    }
  }

  /**
   * Mark events as processed
   */
  async markEventsAsProcessed(eventIds: string[]): Promise<boolean> {
    try {
      if (eventIds.length === 0) return true;
      
      const { error } = await supabase
        .from('events')
        .update({ processed: true })
        .in('id', eventIds);
      
      if (error) {
        console.error('Error marking events as processed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markEventsAsProcessed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const eventManager = new EventManager();

// Export the EventPayloads type for use in other files
export type { EventPayloads };
