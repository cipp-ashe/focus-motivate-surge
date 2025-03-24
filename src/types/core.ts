
/**
 * Core Types
 */

// Generic tag representation
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

// Tag relation between entities
export interface TagRelation {
  id: string;
  tagId: string;
  entityId: string;
  entityType: 'task' | 'note' | 'habit';
}

// Core relationship types
export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: 'task' | 'habit' | 'note';
  targetId: string;
  targetType: 'task' | 'habit' | 'note';
  relationType: 'parent' | 'child' | 'reference' | 'linked';
  metadata?: Record<string, any>;
}

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  showCompletedTasks: boolean;
  defaultTimerDuration: number;
  enableSounds: boolean;
  enableNotifications: boolean;
  defaultView: 'list' | 'board' | 'calendar';
  sortTasksBy: 'createdAt' | 'dueDate' | 'priority';
  sortDirection: 'asc' | 'desc';
}

// Daily summary type
export interface DailySummary {
  date: string;
  completedTasks: number;
  completedHabits: number;
  totalTaskTime: number;
  notes: number;
  journalEntries: number;
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}
