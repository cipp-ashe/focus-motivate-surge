
export interface TimerEventPayloads {
  'habit:schedule': {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  };
  'habit:template-update': any;
  'habit:template-delete': { templateId: string };
  'habit:template-add': string;
  'habit:custom-template-create': any;
  'habit:custom-template-delete': { templateId: string };
  'habit:template-order-update': any[];
  'task:create': any;
  'task:update': any;
  'task:delete': any;
  'task:select': string;
  'task:complete': any;
  'timer:init': { taskName: string; duration: number };
  'timer:expand': { taskName: string };
  'timer:collapse': { taskName: string; saveNotes: boolean };
  'timer:start': any;
  'timer:pause': any;
  'timer:reset': any;
  'timer:complete': any;
  'timer:metrics-update': any;
  'timer:state-update': any;
  'relationship:create': any;
  'relationship:delete': any;
  'relationship:update': any;
  'relationship:batch-update': any;
  'note:create': any;
  'note:create-from-habit': {
    habitId: string;
    habitName: string;
    description: string;
    templateId?: string; // Add templateId as optional
  };
  'tag:link': any;
  'tag:unlink': any;
  'quote:link-task': any;
}

export type TimerEventType = keyof TimerEventPayloads;
export type TimerEventCallback<T extends TimerEventType> = (payload: TimerEventPayloads[T]) => void;
