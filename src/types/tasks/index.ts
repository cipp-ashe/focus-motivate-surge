
/**
 * Task Types Definition
 */

import { MetricType } from '@/types/habits';

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
  | 'rating';

// Tag definition
export interface Tag {
  name: string;
  color?: string;
}

// Task definition
export interface Task {
  id: string;
  name: string;
  description?: string;
  taskType: TaskType;
  completed: boolean;
  duration: number;
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
}

// Task relationship
export interface TaskRelationship {
  taskId: string;
  entityId: string;
  entityType: string;
  relationshipType?: string;
  metadata?: any;
}

export * from './extensions';
