
import type { Tag } from './tags';

// Task type enum for type checking
export type TaskType = 'habit' | 'timer' | 'regular';

export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  clearReason?: 'manual' | 'completed';
  taskType?: TaskType; // Using the TaskType enum
  relationships?: {
    habitId?: string;
    templateId?: string;
    date?: string;
  };
  metrics?: TaskMetrics;
  tags?: Tag[];
}

export const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
};
