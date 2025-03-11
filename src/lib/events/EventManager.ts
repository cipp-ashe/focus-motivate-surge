
import { TimerEventType, TimerEventPayloads } from '@/types/events';
import { TagEventType } from './types';
import { Note } from '@/types/notes';

// Combine all event types
export type EventType = TimerEventType | TagEventType | NoteEventType;

// Add note event types
export type NoteEventType = 
  | 'note:create'
  | 'note:update'
  | 'note:deleted'
  | 'note:create-from-habit'
  | 'note:create-from-voice';

export interface EventPayloads extends Omit<TimerEventPayloads, 'note:create-from-habit'> {
  // Tag events
  'tag:select': string;
  'tag:remove': any;
  'tags:force-update': {
    timestamp: string;
  };
  'tag:create': any;
  'tag:delete': any;
  
  // Note events
  'note:create': Note;
  'note:update': Note;
  'note:deleted': { noteId: string };
  'note:create-from-habit': {
    habitId?: string;
    habitName: string;
    description?: string;
    templateId?: string;
    content?: string;
  };
  'note:create-from-voice': {
    voiceNoteId?: string;
    title?: string;
    content: string;
  };
}

export type EventHandler<T extends EventType> = (payload: T extends keyof EventPayloads ? EventPayloads[T] : any) => void;

class EventManager {
  private listeners: { [key: string]: EventHandler<any>[] } = {};

  on<T extends EventType>(event: T, callback: EventHandler<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback as EventHandler<any>);
    return () => {
      this.off(event, callback);
    };
  }

  off<T extends EventType>(event: T, callback: EventHandler<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]?.filter(cb => cb !== callback);
  }

  emit<T extends EventType>(event: T, payload: T extends keyof EventPayloads ? EventPayloads[T] : any): void {
    console.log(`Emitting event: ${event}`, payload);
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
  __test_getListeners<T extends EventType>(event: T): EventHandler<T>[] | undefined {
    return this.listeners[event] as EventHandler<T>[] | undefined;
  }
}

export const eventManager = new EventManager();
