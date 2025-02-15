
import { TimerMetrics } from './metrics';
import { Quote } from './timer/models';

export interface TimerEventPayloads {
  'timer:start': {
    taskName: string;
    duration: number;
  };
  'timer:pause': {
    timeLeft: number;
    taskName: string;
  };
  'timer:complete': {
    metrics: TimerMetrics;
    taskName: string;
  };
  'timer:update': {
    timeLeft: number;
    isRunning: boolean;
  };
  'timer:metrics-update': {
    metrics: Partial<TimerMetrics>;
  };
  'timer:quote-favorite': {
    quote: Quote;
    taskName: string;
  };
  'timer:external-start': {
    taskName: string;
    duration: number;
  };
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = 
  (payload: TimerEventPayloads[T]) => void;

