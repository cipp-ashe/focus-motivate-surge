
// Task type enum for type checking
export type TaskType = 'habit' | 'timer' | 'regular';

export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
  
  // Add missing properties referenced in other components
  expectedTime?: number;
  actualDuration?: number;
  favoriteQuotes?: string[];
  pausedTime?: number;
  extensionTime?: number;
  netEffectiveTime?: number;
  efficiencyRatio?: number;
  completionStatus?: string;
  actualTime?: number;
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

// Define Tag here since it appears to be missing or not exported properly
export interface Tag {
  id: string;
  name: string;
  color?: string;
}
