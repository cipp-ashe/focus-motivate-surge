import mitt, { Emitter } from 'mitt';
import { Note } from '@/types/notes';
import { TimerEventPayloads } from '@/types/timer/events';

type Events = {
  'timer:start': { taskName: string; duration: number };
  'timer:pause': { taskName: string };
  'timer:resume': { taskName: string };
  'timer:complete': { taskName: string };
  'timer:reset': { taskName: string };
  'timer:tick': { taskName: string; remaining: number };
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'note:create': Note;
  'note:update': Note;
  'note:delete': { id: string };
  'note:create-from-habit': { 
    habitId: string; 
    habitName: string; 
    description?: string; 
    templateId?: string; 
    content?: string; 
  };
  'note:create-from-voice': { 
    voiceNoteId: string; 
    title: string; 
    content: string; 
  };
};

export interface EventPayloads extends Omit<TimerEventPayloads, 'note:create-from-habit'> {
  'note:create': Note;
  'note:update': Note;
  'note:delete': { id: string };
  'note:create-from-habit': { 
    habitId: string; 
    habitName: string; 
    description?: string; 
    templateId?: string; 
    content?: string; 
  };
  'note:create-from-voice': { 
    voiceNoteId: string; 
    title: string; 
    content: string; 
  };
}

class EventManager {
  private emitter: Emitter<Events>;

  constructor() {
    this.emitter = mitt<Events>();
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.emitter.emit(event, payload);
  }

  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void) {
    this.emitter.on(event, handler);
  }

  off<K extends keyof Events>(event: K, handler?: (payload: Events[K]) => void) {
    this.emitter.off(event, handler);
  }
}

export const eventManager = new EventManager();
