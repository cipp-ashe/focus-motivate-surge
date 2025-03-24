
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
  | 'task:reload'
  | 'task:show-image'
  | 'task:open-checklist'
  | 'task:open-journal'
  | 'task:open-voice-recorder';

export interface TaskEventPayloadMap {
  'task:create': Task;
  'task:update': { 
    taskId: string; 
    updates: Partial<Task>; 
  };
  'task:delete': { 
    taskId: string; 
    reason?: string; 
  };
  'task:complete': { 
    taskId: string; 
    metrics?: any; 
  };
  'task:dismiss': { 
    taskId: string; 
    habitId?: string; 
    date?: string; 
  };
  'task:select': string | null;
  'task:timer': { 
    taskId: string; 
    minutes: number; 
    notes?: string; 
  };
  'task:reload': undefined;
  'task:show-image': { 
    imageUrl: string; 
    taskName: string; 
  };
  'task:open-checklist': { 
    taskId: string; 
    taskName: string; 
    items: any[]; 
  };
  'task:open-journal': { 
    taskId: string; 
    taskName: string; 
    entry: string; 
  };
  'task:open-voice-recorder': { 
    taskId: string; 
    taskName: string; 
  };
}
