
/**
 * Unified Task Type System
 * 
 * This module defines all task-related types including both standard and integrated types
 */

// Basic task types - standard
export type StandardTaskType = 
  | 'regular' 
  | 'checklist' 
  | 'counter'
  | 'rating';

// Integrated task types - these interface with other subsystems
export type IntegratedTaskType = 
  | 'timer' 
  | 'journal' 
  | 'screenshot' 
  | 'voicenote';

// Legacy task types - maintained for backwards compatibility  
export type LegacyTaskType = 
  | 'habit' 
  | 'todo' 
  | 'focus' 
  | 'exercise' 
  | 'reading' 
  | 'meditation' 
  | 'check-in'
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly' 
  | 'reminder';

// Combined task type
export type TaskType = 
  | StandardTaskType 
  | IntegratedTaskType 
  | LegacyTaskType;

// Task priority
export type TaskPriority = 'low' | 'medium' | 'high';

// Task status
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'archived' | 'failed';

// Checklist item for checklist tasks
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Task relationships
export interface TaskRelationships {
  habitId?: string;
  templateId?: string;
  date?: string;
  metricType?: string;
  noteId?: string;
  journalId?: string;
  parentId?: string;
  projectId?: string;
  [key: string]: any;
}

// Task scheduling
export interface TaskSchedule {
  type: 'once' | 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6: Sunday-Saturday
  time?: string; // HH:MM format
}

// Base task interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  taskType: TaskType;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  parentTaskId?: string;
  tags?: string[];
  
  // Type-specific properties
  duration?: number; // In seconds, for timer and time-tracked tasks
  checklistItems?: ChecklistItem[]; // For checklist tasks
  count?: number; // For counter tasks
  target?: number; // Target value for counter tasks
  rating?: number; // For rating tasks
  scale?: number; // Rating scale (e.g. 1-5, 1-10)

  // Integrated type properties
  imageUrl?: string; // For screenshot tasks
  imageType?: string; // For screenshot tasks
  journalEntry?: string; // For journal tasks
  voiceNoteUrl?: string; // For voice note tasks
  voiceNoteText?: string; // Transcript for voice note tasks

  // Scheduling
  schedule?: TaskSchedule;

  // Relationships with other entities
  relationships?: TaskRelationships;
}

// Task creation interface (without required id and timestamps)
export type TaskCreationParams = Omit<Task, 'id' | 'createdAt'> & { id?: string };

// Task update interface
export type TaskUpdateParams = Partial<Task>;

// Task filter options
export interface TaskFilter {
  completed?: boolean;
  taskType?: TaskType | TaskType[];
  dueDate?: { from?: string; to?: string };
  priority?: TaskPriority | TaskPriority[];
  tags?: string[];
  search?: string;
}

// Storage key for tasks
export const TASKS_STORAGE_KEY = 'tasks';
