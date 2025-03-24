
// Task domain event types

export type TaskEventType =
  | 'task:add'
  | 'task:update'
  | 'task:delete'
  | 'task:complete'
  | 'task:uncomplete'
  | 'task:timer'
  | 'task:status-change'
  | 'task:selected'
  | 'task:unselected'
  | 'task:reorder'
  | 'task:import'
  | 'task:checklist-update'
  | 'task:journal-update';

export interface TaskEventPayloadMap {
  'task:add': {
    task: any;
  };
  'task:update': {
    taskId: string;
    updates: any;
  };
  'task:delete': {
    taskId: string;
  };
  'task:complete': {
    taskId: string;
    metrics?: any;
  };
  'task:uncomplete': {
    taskId: string;
  };
  'task:timer': {
    taskId: string;
    minutes: number;
    notes?: string;
  };
  'task:status-change': {
    taskId: string;
    status: string;
  };
  'task:selected': {
    taskId: string;
  };
  'task:unselected': {
    taskId: string;
  };
  'task:reorder': {
    taskIds: string[];
  };
  'task:import': {
    tasks: any[];
  };
  'task:checklist-update': {
    taskId: string;
    items: any[];
  };
  'task:journal-update': {
    taskId: string;
    entry: string;
  };
}
