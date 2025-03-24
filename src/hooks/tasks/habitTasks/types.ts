
/**
 * Types for habit task integration
 */
import { TaskType } from '@/types/tasks';
import { MetricType } from '@/types/habits/types';

/**
 * Options for habit task creation
 */
export interface HabitTaskOptions {
  metricType?: MetricType;
  taskType?: TaskType;
  suppressToast?: boolean;
  selectAfterCreate?: boolean;
  duration?: number;
}

/**
 * Event payload for habit task scheduling
 */
export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: MetricType;
}

/**
 * Return type for habit task scheduler
 */
export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: React.MutableRefObject<Map<string, string>>;
  handleHabitSchedule: (event: HabitTaskEvent) => string | null;
  checkForMissingHabitTasks: () => void;
}
