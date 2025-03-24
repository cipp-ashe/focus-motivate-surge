
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
  | 'timer:collapse';

export interface TimerEventPayloadMap {
  'timer:start': { 
    taskId?: string; 
    minutes: number; 
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
    metrics?: {
      totalTime?: number;
      pauseCount?: number;
      extensionCount?: number;
      originalDuration?: number;
      actualDuration?: number;
      startTime?: string;
      endTime?: string;
      pausedTime?: number;
      extensionTime?: number;
      netEffectiveTime?: number;
      completionDate?: string;
    };
  };
  'timer:extend': { 
    taskId?: string; 
    minutes: number;
    taskName?: string;
  };
  'timer:reset': { 
    taskId?: string;
    taskName?: string;
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
    metrics: {
      totalTime?: number;
      pauseCount?: number;
      extensionCount?: number;
      originalDuration?: number;
      actualDuration?: number;
      startTime?: string;
      endTime?: string;
      pausedTime?: number;
      extensionTime?: number;
      netEffectiveTime?: number;
      completionDate?: string;
    };
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
}
