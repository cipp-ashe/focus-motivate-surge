
/**
 * Core Types
 * Fundamental types used across the application
 */

// Entity types for relationships
export enum EntityType {
  Task = 'task',
  Habit = 'habit',
  HabitTemplate = 'habit-template',
  Note = 'note',
  VoiceNote = 'voice-note',
  Timer = 'timer',
  Tag = 'tag',
  Quote = 'quote',
  Journal = 'journal',
  User = 'user'
}

// Relationship types
export type RelationType = 
  | 'tag-entity'
  | 'quote-task'
  | 'template-habit'
  | 'habit-journal'
  | 'habit-task'
  | 'voice-note-transcription'
  | 'task-note'
  | 'habit-note'
  | 'source';

// Entity relationship
export interface EntityRelationship {
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
}

// Base state context
export interface StateContext {
  tasks: {
    items: any[];
    completed: any[];
    selected: string | null;
  };
  habits: {
    templates: any[];
    todaysHabits: any[];
    progress: Record<string, Record<string, boolean | number>>;
  };
  notes: {
    items: any[];
    selected: string | null;
  };
  relationships: EntityRelationship[];
}

// Color palette
export type Color = 
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'gray';

// Standard size options
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Daily summary types
export interface DailySummary {
  date: string;
  completedTasks: any[];
  unfinishedTasks: any[];
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  averageEfficiency: number;
  favoriteQuotes: any[];
  notes?: any;
}
