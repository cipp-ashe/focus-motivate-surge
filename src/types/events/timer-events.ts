
/**
 * Timer event types and payload definitions
 */

export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:complete'
  | 'timer:extend'
  | 'timer:reset'
  | 'timer:set-task'
  | 'timer:update-metrics'
  | 'timer:task-set'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:tick'
  | 'timer:init';

export interface TimerEventPayloadMap {
  'timer:start': { 
    taskId?: string; 
    taskName?: string;
    duration?: number;
  };
  'timer:pause': { 
    taskId?: string; 
    timeLeft: number;
    taskName?: string;
  };
  'timer:resume': {
    taskId?: string;
    timeLeft: number;
    taskName?: string;
  };
  'timer:complete': { 
    taskId?: string; 
    taskName?: string;
    metrics?: any;
  };
  'timer:extend': { 
    taskId?: string; 
    minutes: number;
    taskName?: string;
  };
  'timer:reset': { 
    taskId?: string;
    taskName?: string;
    duration?: number;
  };
  'timer:set-task': { 
    id: string; 
    name: string; 
    duration: number; 
    completed: boolean;
    createdAt: string;
    taskType?: string;
    taskId?: string;
  };
  'timer:update-metrics': { 
    taskId?: string; 
    taskName?: string;
    metrics: any;
  };
  'timer:task-set': {
    id: string;
    name: string;
    duration: number;
    taskId: string;
  };
  'timer:expand': {
    taskName?: string;
  };
  'timer:collapse': {
    taskName?: string;
    saveNotes?: boolean;
  };
  'timer:tick': {
    timeLeft: number;
    taskId?: string;
    taskName?: string;
  };
  'timer:init': {
    duration?: number;
    taskId?: string;
    taskName?: string;
  };
}
