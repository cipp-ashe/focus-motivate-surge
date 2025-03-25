
// Task types
export type TaskType =
  | 'standard'  // Base task type (replacing 'regular')
  | 'timer'     // For timed/pomodoro tasks
  | 'journal'   // For journal entries
  | 'checklist' // For tasks with subtasks
  | 'project'   // For project-level tasks
  | 'habit'     // For habit-tracking tasks
  | 'screenshot'// For screenshot tasks
  | 'voicenote' // For voice note tasks
  | 'recurring'; // For recurring tasks

// Task status
export type TaskStatus =
  | 'todo'      // Not started
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'deferred'
  | 'dismissed';

// Task metrics
export interface TaskMetrics {
  completionTime?: number;  // Time in seconds to complete
  startedAt?: string;
  completedAt?: string;
  pausedTime?: number;
  actualDuration?: number;
  estimatedDuration?: number;
  completionStatus?: 'completed' | 'abandoned' | 'extended';
  timeSpent?: number;      // Total time spent on task
  pauseCount?: number;     // Number of times task was paused
  efficiencyRatio?: number; // Ratio of estimated vs actual time
}

export interface TimeEstimate {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface TaskRelationships {
  habitId?: string;
  projectId?: string;
  checklistItems?: string[];
  date?: string;
  templateId?: string;
  noteId?: string;
  metricType?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  type: TaskType;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  tags?: string[];
  duration?: number;
  completed?: boolean;
  metrics?: TaskMetrics;
  timeEstimate?: TimeEstimate;
  relationships?: TaskRelationships;
  // Task type specific fields
  imageUrl?: string;
  fileName?: string;
  audioUrl?: string;
  audioText?: string;
  audioDuration?: number;
  checklistItems?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

export interface Tag {
  id: string;
  name: string;
}

