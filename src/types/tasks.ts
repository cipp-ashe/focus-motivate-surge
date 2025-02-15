import { Tag } from "./core";
import { TimerMetrics } from "./metrics";

export interface TaskMetrics extends Omit<TimerMetrics, 'startTime' | 'lastPauseTimestamp' | 'isPaused' | 'pausedTimeLeft'> {
  endTime?: string;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: string;
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
