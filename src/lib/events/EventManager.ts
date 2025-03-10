
import { TimerEventType, TimerEventCallback, TimerEventPayloads } from '@/types/events';

type EventType = TimerEventType;
type EventPayload = TimerEventPayloads;
export type EventHandler<T extends EventType> = (payload: EventPayload[T]) => void;

class EventManager {
  private listeners: { [K in EventType]?: ((payload: EventPayload[K]) => void)[] } = {};

  on<T extends EventType>(event: T, callback: EventHandler<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
    return () => {
      this.off(event, callback);
    };
  }

  off<T extends EventType>(event: T, callback: EventHandler<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]?.filter(cb => cb !== callback);
  }

  emit<T extends EventType>(event: T, payload: EventPayload[T]): void {
    this.listeners[event]?.forEach(callback => {
      callback(payload);
    });
  }

  /**
   * Clear all event listeners
   * @param event Optional event type to clear only specific event listeners
   */
  clear(event?: EventType): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  /**
   * WARNING: This is for internal testing only. Do not use this in production.
   * @param event 
   */
  __test_getListeners<T extends EventType>(event: T): ((payload: EventPayload[T]) => void)[] | undefined {
    return this.listeners[event];
  }
}

export const eventManager = new EventManager();

export type {
  EventType,
  EventPayload,
  EventHandler
};
