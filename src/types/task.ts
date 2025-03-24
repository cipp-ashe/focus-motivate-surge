
/**
 * Unified Task Type System
 * Single source of truth for all task-related types
 */

import { MetricType } from './habit';

// Unified task type
export type TaskType = 
  | 'regular'
  | 'timer'
  | 'checklist'
  | 'journal'
  | 'screenshot'
  | 'voicenote'
  | 'habit'
  | 'counter'
  | 'rating'
  | 'focus'
  | 'todo'
  | 'exercise'
  | 'reading'
  | 'meditation'
  | 'check-in'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'reminder';

/**
 * Task status to track progress
 */
export type TaskStatus = 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';

// Tag definition
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

// Checklist item interface
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Task metrics interface
export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
  expectedTime?: number;
  actualDuration?: number;
  favoriteQuotes?: string[];
  pausedTime?: number;
  extensionTime?: number;
  netEffectiveTime?: number;
  efficiencyRatio?: number;
  completionStatus?: string;
  actualTime?: number;
  startTime?: string | Date;
  endTime?: string | Date;
  notes?: string;
  tags?: string[];
  difficulty?: number;
  satisfaction?: number;
  energy?: number;
  focus?: number;
  distractions?: number;
  [key: string]: any;
}

// Task definition
export interface Task {
  id: string;
  name: string;
  description?: string;
  taskType: TaskType;
  completed: boolean;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  dismissedAt?: string;
  clearReason?: 'completed' | 'dismissed' | 'manual';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: Tag[];
  recurrence?: any;
  subtasks?: Task[];
  parentId?: string;
  relationships?: {
    habitId?: string;
    templateId?: string;
    date?: string;
    noteId?: string;
    metricType?: MetricType;
  };
  journalEntry?: string;
  timerNotes?: string;
  timerMinutes?: number;
  rating?: number;
  count?: number;
  voiceNoteUrl?: string;
  voiceNoteText?: string;
  voiceNoteDuration?: number;
  status?: TaskStatus;
  
  // Screenshot task specific fields
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
  
  // Checklist task specific fields
  checklistItems?: ChecklistItem[];
  
  // Task performance metrics
  metrics?: TaskMetrics;
}

// Task relationship
export interface TaskRelationship {
  taskId: string;
  entityId: string;
  entityType: string;
  relationshipType?: string;
  metadata?: any;
}

// Storage constants
export const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
};

// State interfaces
export interface TaskState {
  items: Task[];
  completed: Task[];
  cleared: Task[];
  selected: string | null;
}

export interface TaskContextState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string, reason?: string) => void;
  completeTask: (taskId: string, metrics?: any) => void;
  selectTask: (taskId: string | null) => void;
}
