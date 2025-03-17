
import { EventType, EventHandler, EventPayloads } from './EventManager';

export type { EventType, EventHandler, EventPayloads };

// Export tag event types
export type TagEventType = 'tag:select' | 'tag:remove' | 'tags:force-update' | 'tag:create' | 'tag:delete';

// Additional event types
export type HabitEventType = 
  | 'habits:check-pending'
  | 'habits:processed'
  | 'habit:journal-complete'
  | 'habit:progress-update'
  | 'habit:task-deleted'
  | 'habit:dismissed';

export type TimerEventTypes =
  | 'timer:task-set'
  | 'timer:select-task'
  | 'timer:set-task';

export type AppEventTypes =
  | 'app:initialization-complete'
  | 'app:initialized';

export type NavigationEventType = 
  | 'nav:route-change'
  | 'page:timer-ready';

// Making sure all events are properly typed for the event system
export type AdditionalEventTypes = HabitEventType | NavigationEventType | TimerEventTypes | AppEventTypes;
