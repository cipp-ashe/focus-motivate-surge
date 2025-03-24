
/**
 * Unified Task Type System
 * 
 * This module serves as the central definition for all task-related types,
 * consolidating the type hierarchy to align with our domain model.
 */

// Core task categories
export type BaseTaskType = 'regular' | 'checklist' | 'counter' | 'rating';
export type IntegratedTaskType = 'journal' | 'timer' | 'screenshot' | 'voicenote';
export type TaskType = BaseTaskType | IntegratedTaskType;

// Task status to track progress
export type TaskStatus = 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';

// Task metrics interface
export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
  
  // Timer-specific metrics
  expectedTime?: number;
  actualTime?: number;
  pausedTime?: number;
  extensionTime?: number;
  netEffectiveTime?: number;
  efficiencyRatio?: number;
  completionStatus?: string;
  
  // Counter-specific metrics
  count?: number;
  target?: number;
  
  // Rating-specific metrics
  rating?: number;
  scale?: number;
}

// Task integration relationships
export interface TaskRelationships {
  habitId?: string;    // If this task was created from a habit
  templateId?: string; // The template that contains the habit
  date?: string;       // The date this habit task is for
  noteId?: string;     // ID of the note associated with this task
  timerId?: string;    // ID of the timer session
  audioId?: string;    // ID of the voice note
  metricType?: string; // Legacy field for backward compatibility
}

// Checklist item for checklist tasks
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Core Task interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  dismissedAt?: string;
  clearReason?: 'manual' | 'completed' | 'dismissed';
  taskType: TaskType;
  status?: TaskStatus;
  relationships?: TaskRelationships;
  metrics?: TaskMetrics;
  tags?: string[];
  
  // Media content fields
  content?: string;          // For journal entries or text content
  
  // Screenshot-specific fields
  imageUrl?: string;
  imageType?: 'screenshot' | 'image' | null;
  fileName?: string;
  capturedText?: string;
  imageMetadata?: {
    dimensions: {
      width: number;
      height: number;
    };
    fileSize: number;
    format: string;
  };
  
  // Checklist-specific field
  checklistItems?: ChecklistItem[];
  
  // Voice note-specific fields
  audioUrl?: string;
  audioText?: string;
  audioDuration?: number;
}

// Storage keys
export const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
};

// Task state for context
export interface TaskState {
  items: Task[];
  completed: Task[];
  cleared: Task[];
  selected: string | null;
  isLoaded: boolean;
}
