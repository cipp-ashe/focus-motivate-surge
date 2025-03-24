
/**
 * Task event types and payload definitions
 */
import { Task } from '@/types/tasks';

export type TaskEventType = 
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:dismiss'
  | 'task:select'
  | 'task:timer'
  | 'task:force-update'
  | 'task:reload';

export interface TaskEventPayloadMap {
  'task:create': Task;
  'task:update': { taskId: string; updates: Partial<Task> };
  'task:delete': { taskId: string; reason?: string };
  'task:complete': { taskId: string; metrics?: any };
  'task:dismiss': { taskId: string; habitId?: string; date?: string };
  'task:select': string | null;
  'task:timer': { taskId: string; minutes: number; notes?: string };
  'task:force-update': undefined;
  'task:reload': undefined;
}
