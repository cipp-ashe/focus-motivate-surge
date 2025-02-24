export interface TimerEventPayloads {
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  };
  'task:create': any;
  'task:update': any;
  'task:delete': any;
  'task:select': string;
  'task:complete': any;
  'relationship:create': any;
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = (payload: TimerEventPayloads[T]) => void;
