/**
 * Task types
 */

// Task type
export type TaskType =
  | 'standard'
  | 'habit'
  | 'journal'
  | 'recurring'
  | 'checklist'
  | 'project'
  | 'timer'
  | 'regular'
  | 'screenshot'
  | 'voicenote';

// Task status
export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'deferred'
  | 'dismissed';

// Task priority
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Task time estimate unit
export type TimeUnit = 'minutes' | 'hours' | 'days';

// Task time estimate
export interface TimeEstimate {
  value: number;
  unit: TimeUnit;
}

// Task metrics
export interface TaskMetrics {
  completionTime: number; // Time in seconds to complete
  startedAt?: string;
  completedAt?: string;
  pausedTime?: number;
  actualDuration?: number;
  estimatedDuration?: number;
  completionStatus?: 'completed' | 'abandoned' | 'extended';
}

// Checklist item interface
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Task interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  status?: TaskStatus;
  type?: TaskType;
  taskType?: TaskType;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  tags?: string[];
  duration?: number;
  timeEstimate?: TimeEstimate;
  completed?: boolean;
  metrics?: TaskMetrics;
  parentId?: string;
  dismissedAt?: string;
  imageUrl?: string;
  imageMetadata?: {
    width?: number;
    height?: number;
    caption?: string;
    tags?: string[];
    createdAt?: string;
  };
  voiceNoteUrl?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    count?: number;
  };
  relationships?: {
    habitId?: string;
    projectId?: string;
    checklistItems?: string[];
    date?: string;
  };
  // Content extensions
  notes?: string;
  journalEntry?: string;
  checklistItems?: ChecklistItem[];
  attachments?: Array<{
    id: string;
    type: 'image' | 'audio' | 'file';
    url: string;
    name?: string;
  }>;
}
