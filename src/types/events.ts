
import { TimerMetrics } from './metrics';
import { Quote } from './timer';
import { Task } from './tasks';
import { Note } from './notes';
import { ActiveTemplate } from '@/components/habits/types';
import { EntityRelationship, EntityType } from './state';

export interface TimerEventPayloads {
  // Task Events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: 'manual' | 'habit-removed' | 'completed' };
  'task:complete': { taskId: string; metrics?: TimerMetrics };
  'task:select': string | null;
  
  // Timer Events
  'timer:init': {
    taskName: string;
    duration: number;
  };
  'timer:start': {
    taskName: string;
    duration: number;
    currentTime?: number;
  };
  'timer:pause': {
    taskName: string;
    timeLeft: number;
    metrics: TimerMetrics;
  };
  'timer:resume': {
    taskName: string;
    timeLeft: number;
  };
  'timer:complete': {
    taskName: string;
    metrics: TimerMetrics;
  };
  'timer:reset': {
    taskName: string;
    duration: number;
  };
  'timer:state-update': {
    taskName: string;
    timeLeft: number;
    isRunning: boolean;
    metrics: TimerMetrics;
  };
  'timer:metrics-update': {
    taskName: string;
    metrics: Partial<TimerMetrics>;
  };
  'timer:expand': {
    taskName: string;
  };
  'timer:collapse': {
    taskName: string;
    saveNotes?: boolean;
  };
  'timer:quote-favorite': {
    taskName: string;
    quote: Quote;
  };
  
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
  'tag:link': { tagId: string; entityId: string; entityType: EntityType };
  'tag:unlink': { tagId: string; entityId: string };
  
  // Quote Events
  'quote:link-task': { quoteId: string; taskId: string };
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = 
  (payload: TimerEventPayloads[T]) => void;
