
/**
 * Timer-related event types and payloads
 */

// Timer event type definitions
export type TimerEventType =
  | 'timer:start'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:tick'
  | 'timer:complete'
  | 'timer:reset'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:metrics-update'
  | 'timer:init'
  | 'timer:close'
  | 'timer:expand'
  | 'timer:collapse'
  | 'timer:update-metrics';

// Timer event payload definitions
export interface TimerEventPayloadMap {
  'timer:start': { taskId?: string; taskName: string; duration: number };
  'timer:pause': { taskId?: string; taskName: string; timeLeft: number };
  'timer:resume': { taskId?: string; taskName: string; timeLeft: number };
  'timer:tick': { timeLeft: number; taskName: string };
  'timer:complete': { taskId?: string; taskName: string; metrics: any };
  'timer:reset': { taskId?: string; taskName: string; duration?: number };
  'timer:set-task': { id: string; name: string; duration: number; taskId?: string; completed?: boolean; createdAt?: string };
  'timer:task-set': { id: string; name: string; duration: number; taskId?: string; completed?: boolean; createdAt?: string };
  'timer:metrics-update': Record<string, any>;
  'timer:init': any;
  'timer:close': any;
  'timer:expand': any;
  'timer:collapse': any;
  'timer:update-metrics': any;
}
