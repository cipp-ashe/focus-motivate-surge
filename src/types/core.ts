
/**
 * Core Types
 */

// Generic tag representation
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  createdAt?: string;
}

// Tag relation between entities
export interface TagRelation {
  id: string;
  tagId: string;
  entityId: string;
  entityType: 'task' | 'note' | 'habit';
  createdAt?: string;
}

// Entity type enum
export type EntityType = 'task' | 'note' | 'habit' | 'timer' | 'journal';

// Color type
export type Color = 'default' | 'red' | 'green' | 'blue' | 'purple' | 'yellow' | 'orange' | 'cyan' | 'pink';

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

/**
 * Initialize the data store with default values
 * @returns boolean indicating if initialization was successful
 */
export function initializeDataStore(): boolean {
  try {
    // Set schema version
    if (!localStorage.getItem('schema-version')) {
      localStorage.setItem('schema-version', '1.0');
    }
    
    // Initialize entity relations
    if (!localStorage.getItem('entity-relations')) {
      localStorage.setItem('entity-relations', JSON.stringify([]));
    }
    
    // Initialize tag relations
    if (!localStorage.getItem('tag-relations')) {
      localStorage.setItem('tag-relations', JSON.stringify([]));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    return false;
  }
}
