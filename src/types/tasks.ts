
import { Tag } from "./core";
import { TimerMetrics } from "./metrics";

export interface TaskMetrics extends Omit<TimerMetrics, 'startTime' | 'lastPauseTimestamp' | 'isPaused' | 'pausedTimeLeft'> {
  endTime: Date | null;
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

// We don't need TaskContextType anymore since we're using the event bus
export interface TaskState {
  items: Task[];
  completed: Task[];
  selected: string | null;
}
