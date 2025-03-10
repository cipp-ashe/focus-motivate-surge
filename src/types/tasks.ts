
export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  clearReason?: 'manual' | 'completed';
  relationships?: {
    habitId?: string;
    templateId?: string;
    date?: string;
  };
  metrics?: TaskMetrics;
  tags?: Tag[];
  taskType?: 'habit' | 'timer' | 'regular'; // Adding task type field
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface TaskMetrics {
  actualTime?: number;
  estimatedTime?: number;
  interruptions?: number;
  expectedTime?: number;
  actualDuration?: number;
  pauseCount?: number;
  favoriteQuotes?: number;
  pausedTime?: number;
  extensionTime?: number;
  netEffectiveTime?: number;
  efficiencyRatio?: number;
  completionStatus?: string;
}

export interface TaskState {
  items: Task[];
  completed: Task[];
  selected: string | null;
}
