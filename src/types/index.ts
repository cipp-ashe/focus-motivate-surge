
/**
 * Types Index
 * 
 * This file re-exports all types from the various type modules
 * to provide a single import point for consumers.
 */

// Core types
export * from './core';

// Domain-specific types
export type { 
  // Habit types
  DayOfWeek, DayOfWeekFull, HabitCategory, TimePreference, MetricType,
  Habit, HabitDetail, HabitMetrics, HabitCompletion, HabitProgress, HabitLog,
  HabitTemplate, ActiveTemplate, NewTemplate,
  HabitCompletionEvent, TemplateUpdateEvent, 
} from './habit';

export type {
  // Task types
  TaskType, TaskStatus, Task, ChecklistItem, TaskMetrics, TaskRelationship,
  TaskState, TaskContextState
} from './task';

export type {
  // Note types
  TagColor, Tag, Relationship, NoteContentType, AudioMetadata, Note,
  VoiceNote, VoiceNoteState
} from './note';

export type {
  // Timer types
  TimerMode, TimerStatus, SoundOption, QuoteCategory, Quote, 
  TimerState, TimerAction, TimerStateMetrics, TimerMetrics, TimerExpandedViewRef,
  TimerDisplayProps, TimerControlsProps, TimerProgressProps, TimerSessionProps, TimerMetricsDisplayProps,
  TimerPresetDuration, TimerPresetsProps, TimerCircleProps, MinutesInputProps, TimerA11yProps,
  ButtonA11yProps, SoundSelectorProps, TimerProps,
} from './timer';

export type {
  // Event types
  EventType, EventPayload, EventCallback, 
  TimerEventType, CoreEventType, HabitEventType,
  BaseEventCallback, EventHandler, EventDispatcher, EventUnsubscribe,
  HabitTaskEvent, HabitEventPayloadMap
} from './event';

// Constants
export { 
  DAYS_OF_WEEK, SHORT_DAYS, DAY_MAPPINGS,
  DEFAULT_WEEKDAYS, DEFAULT_WEEKEND, DEFAULT_ALL_DAYS, DEFAULT_ACTIVE_DAYS,
  TIME_PREFERENCES, HABIT_CATEGORIES, METRIC_TO_TASK_TYPE,
  STORAGE_KEY as HABIT_STORAGE_KEY, ACTIVE_TEMPLATES_KEY, CUSTOM_TEMPLATES_KEY, HABIT_PROGRESS_KEY,
  TIMER_CONSTANTS, SOUND_OPTIONS
} from './habit';

export { TASK_STORAGE_KEYS } from './task';

// Utility functions
export { 
  isValidTagColor, createNote, createVoiceNote,
  convertTimerMetricsToTaskMetrics, convertTaskMetricsToTimerMetrics
} from './note';
