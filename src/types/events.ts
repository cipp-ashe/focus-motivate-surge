
import { Task, TaskMetrics } from './tasks';
import { Note } from './notes';
import { HabitTemplate, ActiveTemplate, HabitDetail, DayOfWeek } from '@/components/habits/types';

/**
 * Event types supported by the EventManager
 */
export type EventType = 
  // Task events
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:force-update'
  | 'task:timer-start'
  | 'task:timer-pause'
  | 'task:timer-resume'
  | 'task:timer-stop'
  | 'task:timer-extend'
  | 'task:convert'
  | 'task:add-tag'
  | 'task:remove-tag'
  
  // Habit events
  | 'habit:complete'
  | 'habit:update'
  | 'habit:create'
  | 'habit:delete'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-delete'
  | 'habit:template-select'
  | 'habit:check-pending'
  | 'habits:check-pending'
  | 'habit:task-create'
  
  // Timer events
  | 'timer:init'
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:stop'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:extend'
  
  // Note events
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  
  // Voice note events
  | 'voicenote:create'
  | 'voicenote:update'
  | 'voicenote:delete'
  | 'voicenote:transcribe'
  
  // Screenshot events
  | 'screenshot:create'
  | 'screenshot:save'
  | 'screenshot:delete'
  
  // Tag events
  | 'tag:create'
  | 'tag:update'
  | 'tag:delete'
  | 'tag:link'
  | 'tag:unlink'
  
  // UI events
  | 'ui:theme-change'
  | 'ui:notification'
  | 'ui:modal-open'
  | 'ui:modal-close'
  | 'ui:drawer-open'
  | 'ui:drawer-close';

/**
 * Callback type for event handlers
 */
export type EventCallback<T extends EventType> = (payload: EventPayloads[T]) => void;

/**
 * Event payload types for all event types
 */
export interface EventPayloads {
  // Task events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: TaskMetrics };
  'task:select': string;
  'task:force-update': undefined;
  'task:timer-start': { taskId: string; startTime: string };
  'task:timer-pause': { taskId: string; pauseTime: string };
  'task:timer-resume': { taskId: string; resumeTime: string };
  'task:timer-stop': { taskId: string; stopTime: string; duration: number };
  'task:timer-extend': { taskId: string; extensionTime: number };
  'task:convert': { taskId: string; newType: string };
  'task:add-tag': { taskId: string; tagId: string };
  'task:remove-tag': { taskId: string; tagId: string };
  
  // Habit events
  'habit:complete': { habitId: string; date: string; value: number | boolean; completed?: boolean };
  'habit:update': { habitId: string; updates: Partial<HabitDetail> };
  'habit:create': HabitDetail;
  'habit:delete': { habitId: string };
  'habit:template-add': { templateId: string } | HabitTemplate;
  'habit:template-update': ActiveTemplate;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-select': { templateId: string };
  'habit:check-pending': Record<string, any>;
  'habits:check-pending': Record<string, any>;
  'habit:task-create': { 
    habitId: string; 
    templateId: string; 
    name: string; 
    duration: number; 
    date: string; 
    metricType?: string 
  };
  
  // Timer events
  'timer:init': { taskName: string; duration: number };
  'timer:start': { taskId?: string; taskName: string; duration: number };
  'timer:pause': { taskId?: string; elapsedTime: number };
  'timer:resume': { taskId?: string };
  'timer:stop': { taskId?: string; completed: boolean; metrics?: TaskMetrics };
  'timer:reset': { taskId?: string; taskName: string; duration: number };
  'timer:complete': { taskId?: string; metrics: TaskMetrics };
  'timer:extend': { taskId?: string; extensionTime: number };
  
  // Note events
  'note:create': { id: string; content: string; noteId?: string; updates?: any };
  'note:update': { id: string; content: string; noteId?: string; updates?: any };
  'note:delete': { id: string };
  'note:select': { id: string };
  
  // Voice note events
  'voicenote:create': { id: string; url: string; taskId?: string };
  'voicenote:update': { id: string; url?: string; text?: string };
  'voicenote:delete': { id: string };
  'voicenote:transcribe': { voiceNoteId: string; content: string };
  
  // Screenshot events
  'screenshot:create': { url: string; taskId?: string; fileName?: string };
  'screenshot:save': { url: string; taskId: string; fileName: string };
  'screenshot:delete': { taskId: string };
  
  // Tag events
  'tag:create': { id: string; name: string; color?: string };
  'tag:update': { id: string; name?: string; color?: string };
  'tag:delete': { id: string };
  'tag:link': { tagId: string; taskId: string };
  'tag:unlink': { tagId: string; taskId: string };
  
  // UI events
  'ui:theme-change': { theme: 'light' | 'dark' | 'system' };
  'ui:notification': { message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number };
  'ui:modal-open': { id: string; data?: any };
  'ui:modal-close': { id: string };
  'ui:drawer-open': { id: string; data?: any };
  'ui:drawer-close': { id: string };
}

/**
 * EventHandler function signature
 */
export type EventHandler = (payload: any) => void;

/**
 * EventUnsubscribe function signature
 */
export type EventUnsubscribe = () => void;
