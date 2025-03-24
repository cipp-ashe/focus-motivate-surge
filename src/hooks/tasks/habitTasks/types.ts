
import { MetricType } from '@/types/habits/types';

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
}

export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: React.MutableRefObject<Map<string, string>>;
  checkForMissingHabitTasks: () => void;
}
