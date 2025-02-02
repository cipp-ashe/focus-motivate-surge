export interface Task {
  id: string;
  name: string;
  completed: boolean;
  metrics?: {
    originalDuration: number;
    actualDuration: number;
    pauseCount: number;
    favoriteQuotes: number;
    pausedTime: number;
    extensionTime: number;
    netEffectiveTime: number;
    efficiencyRatio: number;
    completionStatus: string;
  };
}

export interface Quote {
  text: string;
  author: string;
  timestamp?: string;
  task?: string;
}

export interface DailySummary {
  completedTasks: Array<{
    taskName: string;
    metrics?: {
      actualDuration: number;
      efficiencyRatio: number;
    };
  }>;
  totalTimeSpent: number;
  favoriteQuotes: Quote[];
}

export interface RequestBody {
  email: string;
  summaryData: DailySummary;
}