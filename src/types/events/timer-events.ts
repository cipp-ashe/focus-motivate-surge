
/**
 * Timer event types and payload definitions
 */

export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:complete'
  | 'timer:extend'
  | 'timer:reset'
  | 'timer:set-task'
  | 'timer:update-metrics';

export interface TimerEventPayloadMap {
  'timer:start': { 
    taskId?: string; 
    minutes: number; 
    taskName?: string;
  };
  'timer:pause': { 
    taskId?: string; 
    timeLeft: number;
  };
  'timer:complete': { 
    taskId?: string; 
    metrics?: any;
  };
  'timer:extend': { 
    taskId?: string; 
    minutes: number;
  };
  'timer:reset': { 
    taskId?: string; 
  };
  'timer:set-task': { 
    id: string; 
    name: string; 
    duration: number; 
    completed: boolean;
    createdAt: string;
    taskType?: string;
  };
  'timer:update-metrics': { 
    taskId?: string; 
    metrics: any;
  };
}
