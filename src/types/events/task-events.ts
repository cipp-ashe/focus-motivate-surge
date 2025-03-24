
/**
 * Task-related event types and payloads
 */
import { Task } from '@/types/tasks';

// Task event type definitions
export type TaskEventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:select'
  | 'task:dismiss'
  | 'task:reload'
  | 'task:force-update';

// Task event payload definitions
export interface TaskEventPayloadMap {
  'task:create': any;
  'task:update': { taskId: string; updates: Partial<any> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:select': string;
  'task:dismiss': { taskId: string; habitId: string; date: string };
  'task:reload': undefined;
  'task:force-update': undefined;
}
