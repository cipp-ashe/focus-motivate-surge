
/**
 * Event System Types
 */

import { Task } from './task';
import { Note } from './note';
import { TimerMetrics } from './timer';
import { 
  ActiveTemplate, 
  HabitTemplate, 
  HabitDetail,
  DayOfWeek
} from './habit';

// Event types
export type EventType =
  // Task events
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:reload'
  | 'task:dismiss'
  | 'task:force-update'
  | 'task:timer'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voicenote'
  | 'task:open-voice-recorder'

  // Timer events
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:tick'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:metrics-update'

  // Habit events
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:template-update'
  | 'habit:template-create'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:tasks-sync'
  | 'habit:dismissed'
  | 'habit:schedule'
  | 'habit:custom-template-create'
  | 'habit:note-create'
  | 'habit:journal-create'
  | 'habit:select'

  // Note events
  | 'note:add'
  | 'note:update'
  | 'note:delete'
  | 'note:select'

  // Journal events
  | 'journal:create'
  | 'journal:update'
  | 'journal:delete'
  | 'journal:open'
  | 'journal:save'

  // Voice note events
  | 'voice-note:create'
  | 'voice-note:add'

  // Relationship events
  | 'relationship:update'
  | 'relationship:batch-update'
  | 'tag:link'
  | 'tag:unlink'
  | 'quote:link-task'
  
  // App events
  | 'app:initialized'
  
  // Wildcard event
  | '*';

// Event payload types
export type EventPayload<T extends EventType> =
  T extends 'task:create' ? Task :
  T extends 'task:update' ? { taskId: string; updates: Partial<Task> } :
  T extends 'task:delete' ? { taskId: string; reason?: string } :
  T extends 'task:complete' ? { taskId: string; metrics?: any } :
  T extends 'task:select' ? string | null :
  T extends 'task:reload' ? undefined :
  T extends 'task:force-update' ? undefined :
  T extends 'task:dismiss' ? { taskId: string; habitId: string; date: string } :
  T extends 'task:timer' ? { taskId: string; minutes: number; notes?: string } :
  T extends 'task:show-image' ? { imageUrl: string; taskName: string } :
  T extends 'task:open-checklist' ? { taskId: string; taskName: string; items: any[] } :
  T extends 'task:open-journal' ? { taskId: string; taskName: string; entry: string } :
  T extends 'task:open-voicenote' ? { taskId: string; taskName: string } :
  T extends 'task:open-voice-recorder' ? { taskId: string; taskName: string } :
  
  T extends 'timer:start' ? { taskId?: string; taskName?: string; duration?: number } :
  T extends 'timer:pause' ? { taskId?: string; timeLeft: number; taskName?: string } :
  T extends 'timer:resume' ? { taskId?: string; timeLeft: number; taskName?: string } :
  T extends 'timer:tick' ? { timeLeft: number; taskId?: string; taskName?: string } :
  T extends 'timer:reset' ? { taskId?: string; taskName?: string; duration?: number } :
  T extends 'timer:complete' ? { taskId?: string; taskName?: string; metrics?: any } :
  T extends 'timer:set-task' ? { id: string; name: string; duration: number } :
  T extends 'timer:task-set' ? { id: string; name: string; duration: number; taskId: string } :
  T extends 'timer:metrics-update' ? { metrics: TimerMetrics } :
  
  T extends 'habit:complete' ? { habitId: string; date: string; value?: any } :
  T extends 'habit:dismiss' ? { habitId: string; date: string } :
  T extends 'habit:template-update' ? { 
    templateId: string; 
    name?: string; 
    description?: string; 
    habits?: HabitDetail[]; 
    activeDays?: DayOfWeek[];
    customized?: boolean;
    suppressToast?: boolean;
  } :
  T extends 'habit:template-create' ? HabitTemplate :
  T extends 'habit:template-delete' ? { templateId: string } :
  T extends 'habit:template-days-update' ? { templateId: string; activeDays: DayOfWeek[] } :
  T extends 'habit:template-order-update' ? { templateIds: string[] } :
  T extends 'habit:custom-template-create' ? HabitTemplate :
  T extends 'habit:tasks-sync' ? { date: string } :
  T extends 'habit:dismissed' ? { habitId: string; date: string } :
  T extends 'habit:schedule' ? { date: string } :
  T extends 'habit:note-create' ? { habitId: string; content: string; title?: string } :
  T extends 'habit:journal-create' ? { habitId: string; content: string; habitName?: string; date?: string } :
  T extends 'habit:select' ? { habitId: string } :
  
  T extends 'note:add' ? Note :
  T extends 'note:update' ? { noteId: string; updates: Partial<Note> } :
  T extends 'note:delete' ? { noteId: string } :
  T extends 'note:select' ? string :
  
  T extends 'journal:create' ? { 
    habitId?: string;
    habitName?: string;
    taskId?: string;
    templateId?: string;
    title?: string;
    content: string;
    date?: string;
    tags?: string[];
  } :
  T extends 'journal:update' ? { id: string; updates: Partial<Note> } :
  T extends 'journal:delete' ? { id: string } :
  T extends 'journal:open' ? {
    habitId?: string;
    habitName?: string;
    description?: string;
    templateId?: string;
    taskId?: string;
    date?: string;
    content?: string;
  } :
  T extends 'journal:save' ? { taskId: string; entry: string } :
  
  T extends 'voice-note:create' ? { audioUrl: string; duration: number; transcript?: string; title?: string } :
  T extends 'voice-note:add' ? { note: Note } :
  
  T extends 'relationship:update' ? { 
    sourceId: string; 
    sourceType: string; 
    targetId: string; 
    targetType: string;
    relationType: string;
  } :
  T extends 'relationship:batch-update' ? Array<{
    sourceId: string; 
    sourceType: string; 
    targetId: string; 
    targetType: string;
    relationType: string;
  }> :
  T extends 'tag:link' ? { tagId: string; entityId: string; entityType: string } :
  T extends 'tag:unlink' ? { tagId: string; entityId: string } :
  T extends 'quote:link-task' ? { quoteId: string; taskId: string } :
  
  T extends 'app:initialized' ? undefined :
  
  T extends '*' ? { eventType: EventType; payload: any } :
  any;

// Event unsubscribe function
export type EventUnsubscribe = () => void;

// Event callback type
export type EventCallback<E extends EventType> = (payload: EventPayload<E>) => void;
