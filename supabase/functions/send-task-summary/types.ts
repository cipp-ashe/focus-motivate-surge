export interface TaskMetrics {
  originalDuration: number;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: string;
  pauseCount: number;
  favoriteQuotes: number;
}

export interface TaskSummary {
  taskName: string;
  completed: boolean;
  metrics?: TaskMetrics;
  relatedQuotes: Array<{ text: string; author: string }>;
}

export interface RequestBody {
  email: string;
  summaryData: {
    completedTasks: TaskSummary[];
    unfinishedTasks: TaskSummary[];
    totalTimeSpent: number;
    favoriteQuotes: Array<{ text: string; author: string }>;
  };
}