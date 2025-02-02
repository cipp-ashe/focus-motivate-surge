export interface Task {
  taskName: string;
  metrics?: {
    actualDuration: number;
    efficiencyRatio: number;
    originalDuration: number;
    pauseCount: number;
    pausedTime: number;
    extensionTime: number;
    netEffectiveTime: number;
    completionStatus: string;
  };
}

export interface Quote {
  text: string;
  author: string;
}

export interface DailySummary {
  completedTasks: Task[];
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  averageEfficiency: number;
  favoriteQuotes: Quote[];
}