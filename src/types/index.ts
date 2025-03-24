
/**
 * Types Index
 * 
 * This file re-exports all types from the various type modules
 * to provide a single import point for consumers.
 */

// Core types
export * from './core';

// Domain-specific types
export { 
  // Habit types
  DayOfWeek, DayOfWeekFull, DAYS_OF_WEEK, SHORT_DAYS, DAY_MAPPINGS,
  DEFAULT_WEEKDAYS, DEFAULT_WEEKEND, DEFAULT_ALL_DAYS, DEFAULT_ACTIVE_DAYS,
  TimePreference, TIME_PREFERENCES,
  HabitCategory, HABIT_CATEGORIES,
  MetricType, METRIC_TO_TASK_TYPE,
  Habit, HabitDetail, HabitMetrics, HabitCompletion, HabitProgress, HabitLog,
  HabitTemplate, ActiveTemplate, NewTemplate,
  HabitCompletionEvent, TemplateUpdateEvent,
  STORAGE_KEY as HABIT_STORAGE_KEY, ACTIVE_TEMPLATES_KEY, CUSTOM_TEMPLATES_KEY, HABIT_PROGRESS_KEY
} from './habit';

export {
  // Task types
  TaskType, TaskStatus, Task, ChecklistItem, TaskMetrics, TaskRelationship,
  TaskState, TaskContextState, STORAGE_KEYS as TASK_STORAGE_KEYS,
  Tag as TaskTag
} from './task';

export {
  // Note types
  TagColor, Tag, Relationship, NoteContentType, AudioMetadata, Note,
  isValidTagColor, createNote, createVoiceNote, STORAGE_KEY as NOTE_STORAGE_KEY,
  VoiceNote, VoiceNoteState
} from './note';

export {
  // Timer types
  TimerMode, TimerStatus, SoundOption, QuoteCategory, Quote, TIMER_CONSTANTS, SOUND_OPTIONS,
  TimerState, TimerAction, TimerStateMetrics, TimerMetrics, TimerExpandedViewRef,
  TimerDisplayProps, TimerControlsProps, TimerProgressProps, TimerSessionProps, TimerMetricsDisplayProps,
  TimerPresetDuration, TimerPresetsProps, TimerCircleProps, MinutesInputProps, TimerA11yProps,
  ButtonA11yProps, SoundSelectorProps, TimerProps,
  convertTimerMetricsToTaskMetrics, convertTaskMetricsToTimerMetrics
} from './timer';

export {
  // Event types
  EventType, EventPayload, EventCallback, 
  TimerEventType, CoreEventType, HabitEventType,
  BaseEventCallback, EventHandler, EventDispatcher, EventUnsubscribe,
  HabitTaskEvent, HabitEventPayloadMap
} from './event';

// State types
export * from './state';

// Metrics types
export * from './metrics';

// Summary types
export * from './summary';
