
import { MetricType } from '@/types/habits';

export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}

export interface HabitTaskOptions {
  suppressToast?: boolean;
  selectAfterCreate?: boolean;
  metricType?: MetricType;
  taskType?: string;
}

export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: React.MutableRefObject<Map<string, string>>;
  checkForMissingHabitTasks: () => void;
}
