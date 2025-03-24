
/**
 * Task types
 */

// Task type
export type TaskType = 'standard' | 'habit' | 'recurring' | 'checklist' | 'project';

// Task status
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled' | 'deferred';

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

// Task interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  status?: TaskStatus;
  type?: TaskType;
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
  };
  // Content extensions
  notes?: string;
  journalEntry?: string;
  checklistItems?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  attachments?: Array<{
    id: string;
    type: 'image' | 'audio' | 'file';
    url: string;
    name?: string;
  }>;
  imageUrl?: string;
  voiceNoteUrl?: string;
}
