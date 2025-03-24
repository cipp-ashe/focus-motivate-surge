
/**
 * Event types supported by the event system
 */
export type EventType =
  | 'task:create'
  | 'task:update'
  | 'task:delete'
  | 'task:prioritize'
  | 'task:complete'
  | 'task:select'
  | 'task:clear-selection'
  | 'task:reschedule'
  | 'task:search'
  | 'task:filter'
  | 'task:clear-filters'
  | 'task:schedule'
  | 'task:unschedule'
  | 'task:mark-in-progress'
  | 'task:postpone'
  | 'task:reorder'
  | 'timer:set-task'
  | 'timer:task-set'
  | 'timer:complete'
  | 'timer:pause'
  | 'timer:resume'
  | 'timer:restart'
  | 'timer:add-time'
  | 'timer:set-duration'
  | 'timer:update-progress'
  | 'timer:set-metrics'
  | 'habit:complete'
  | 'habit:dismiss'
  | 'habit:schedule'
  | 'habit:template-add'
  | 'habit:template-update'
  | 'habit:template-remove'
  | 'habit:template-delete'
  | 'habit:template-days-update'
  | 'habit:template-order-update'
  | 'habit:custom-template-create'
  | 'habits:check-pending'
  | 'journal:open'
  | 'journal:save'
  | 'note:create'
  | 'note:update'
  | 'note:delete'
  | 'note:select'
  | 'note:export';

export type EventCallback<T = any> = (payload: T) => void;
