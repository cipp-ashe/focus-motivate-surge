
import { TimerMetrics } from './metrics';
import { Quote } from './timer/models';
import { Task } from './tasks';
import { Note } from './notes';
import { ActiveTemplate } from '@/components/habits/types';
import { EntityRelationship } from './state';

export interface TimerEventPayloads {
  // Timer Events
  'timer:start': {
    taskName: string;
    duration: number;
  };
  'timer:pause': {
    timeLeft: number;
    taskName: string;
  };
  'timer:complete': {
    metrics: TimerMetrics;
    taskName: string;
  };
  'timer:update': {
    timeLeft: number;
    isRunning: boolean;
  };
  'timer:metrics-update': {
    metrics: Partial<TimerMetrics>;
  };
  'timer:quote-favorite': {
    quote: Quote;
    taskName: string;
  };
  'timer:external-start': {
    taskName: string;
    duration: number;
  };
  
  // Task Events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': string;
  'task:complete': { taskId: string; metrics?: TimerMetrics };
  'task:select': string | null;
  
  // Note Events
  'note:create': Note;
  'note:update': { noteId: string; updates: Partial<Note> };
  'note:delete': string;
  
  // Habit Events
  'habit:generate-task': Task;
  'habit:template-update': ActiveTemplate;
  
  // Relationship Events
  'relationship:create': EntityRelationship;
  'relationship:delete': { sourceId: string; targetId: string };
  'relationship:update': EntityRelationship;
  'relationship:batch-update': EntityRelationship[];
  
  // Tag Events
  'tag:link': { tagId: string; entityId: string };
  'tag:unlink': { tagId: string; entityId: string };
  
  // Quote Events
  'quote:link-task': { quoteId: string; taskId: string };
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = 
  (payload: TimerEventPayloads[T]) => void;

