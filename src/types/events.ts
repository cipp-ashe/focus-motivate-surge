
import { Task, TaskMetrics } from './tasks';
import { HabitTemplate, ActiveTemplate, DayOfWeek } from '@/components/habits/types';

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
  | 'task:reload'
  | 'task:dismiss'
  
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
  | 'habit:schedule'
  | 'habit:journal-complete'
  | 'habit:journal-deleted'
  | 'habit:task-create'
  | 'journal:open'
  
  // Timer events
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:stop'
  | 'timer:reset'
  | 'timer:complete'
  | 'timer:extend'
  | 'timer:set-task'
  | 'timer:tick'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics'
  
  // UI events
  | 'ui:theme-change'
  | 'ui:notification'
  | 'ui:modal-open'
  | 'ui:modal-close'
  | 'ui:drawer-open'
  | 'ui:drawer-close'
  | 'ui:note-panel-toggle'
  | 'ui:sidebar-toggle'
  
  // System events
  | 'system:sync-start'
  | 'system:sync-complete'
  | 'system:error'
  | 'system:auth-change'
  | '*'; // Wildcard for listening to all events

/**
 * Payload types for all event types
 */
export interface EventPayloads {
  // Task events
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: TaskMetrics };
  'task:select': string | null;
  'task:force-update': undefined;
  'task:reload': undefined;
  'task:dismiss': { taskId: string; habitId?: string; date: string };
  
  // Habit events
  'habit:complete': { habitId: string; date: string; value?: number | boolean; completed?: boolean };
  'habit:update': { habitId: string; updates: Partial<any> };
  'habit:create': any;
  'habit:delete': { habitId: string };
  'habit:template-add': { templateId: string } | HabitTemplate;
  'habit:template-update': ActiveTemplate;
  'habit:template-delete': { templateId: string; isOriginatingAction?: boolean };
  'habit:template-select': { templateId: string };
  'habit:check-pending': Record<string, any>;
  'habits:check-pending': Record<string, any>;
  'habit:schedule': { 
    habitId: string; 
    templateId: string; 
    name: string; 
    duration: number; 
    date: string; 
    metricType?: string 
  };
  'habit:journal-complete': { habitId: string; templateId: string };
  'habit:journal-deleted': { habitId: string; templateId: string };
  'habit:task-create': { 
    habitId: string; 
    templateId: string; 
    name: string; 
    duration: number; 
    date: string; 
    metricType?: string 
  };
  'journal:open': {
    habitId: string;
    habitName: string;
    description?: string;
    templateId?: string;
  };
  
  // Timer events
  'timer:start': { taskId?: string; taskName: string; duration: number; currentTime?: number };
  'timer:pause': { taskId?: string; elapsedTime: number };
  'timer:resume': { taskId?: string };
  'timer:stop': { taskId?: string; completed: boolean; metrics?: TaskMetrics };
  'timer:reset': { taskId?: string; taskName: string; duration: number };
  'timer:complete': { taskId?: string; metrics: TaskMetrics };
  'timer:extend': { taskId?: string; extensionTime: number };
  'timer:set-task': Task;
  'timer:tick': { taskName?: string; timeLeft?: number; remaining?: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:update-metrics': { taskId: string; metrics: any; taskName?: string };
  
  // UI events
  'ui:theme-change': { theme: 'light' | 'dark' | 'system' };
  'ui:notification': { message: string; type: 'info' | 'success' | 'warning' | 'error'; duration?: number };
  'ui:modal-open': { id: string; data?: any };
  'ui:modal-close': { id: string };
  'ui:drawer-open': { id: string; data?: any };
  'ui:drawer-close': { id: string };
  'ui:note-panel-toggle': boolean;
  'ui:sidebar-toggle': boolean;
  
  // System events
  'system:sync-start': undefined;
  'system:sync-complete': { success: boolean; error?: string };
  'system:error': { message: string; code?: string; stack?: string };
  'system:auth-change': { authenticated: boolean; userId?: string };
  '*': any; // Wildcard payload
}

/**
 * Helper type to get payload type for a specific event
 */
export type EventPayload<T extends EventType> = T extends keyof EventPayloads 
  ? EventPayloads[T] 
  : any;

/**
 * Callback function type for event handlers
 */
export type EventCallback<T extends EventType> = (payload: EventPayload<T>) => void;

/**
 * Function returned by event subscription methods to unsubscribe
 */
export type EventUnsubscribe = () => void;
