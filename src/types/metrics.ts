
/**
 * Metrics types
 */

// Timer metrics
export interface TimerStateMetrics {
  startTime: string;
  endTime: string | null;
  completionDate: string | null;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  completionStatus: 'completed' | 'abandoned' | 'extended' | null;
  isPaused: boolean;
  taskId?: string;
}

// Task metrics
export interface TaskStateMetrics {
  completedCount: number;
  totalCount: number;
  avgCompletionTime: number;
  completionRate: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByType: Record<string, number>;
}

// Habit metrics
export interface HabitStateMetrics {
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  habitsByCategory: Record<string, number>;
}
