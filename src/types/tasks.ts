export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  relationships?: {
    habitId?: string;
    templateId?: string;
    date?: string;
  };
}

export interface TaskMetrics {
  actualTime?: number;
  estimatedTime?: number;
  interruptions?: number;
}
