
import { Tag } from "./core";

export interface TaskMetrics {
  expectedTime: number;
  actualDuration: number;
  pauseCount: number;
  favoriteQuotes: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
  endTime?: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  tags?: Tag[];
  metrics?: TaskMetrics;
  relationships?: {
    habitId?: string;
    templateId?: string;
  };
}

export interface TaskContextType {
  tasks: Task[];
  completedTasks: Task[];
  selectedTaskId: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, metrics?: TaskMetrics) => void;
  selectTask: (taskId: string | null) => void;
  clearTasks: () => void;
  clearCompletedTasks: () => void;
}

