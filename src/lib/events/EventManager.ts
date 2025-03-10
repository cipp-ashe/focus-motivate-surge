import { TimerEventType, TimerEventCallback, TimerEventPayloads } from '@/types/events';

type EventType = TimerEventType;
type EventPayload = TimerEventPayloads;

class EventManager {
  private listeners: { [K in EventType]?: ((payload: EventPayload[K]) => void)[] } = {};

  on<T extends EventType>(event: T, callback: TimerEventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
    return () => {
      this.listeners[event] = this.listeners[event]?.filter(cb => cb !== callback);
    };
  }

  emit<T extends EventType>(event: T, payload: EventPayload[T]): void {
    this.listeners[event]?.forEach(callback => {
      callback(payload);
    });
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
  EventPayload
};
