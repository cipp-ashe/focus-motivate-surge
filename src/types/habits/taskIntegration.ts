
/**
 * Habit Task Integration Types
 * 
 * This file defines types for the integration between habits and tasks
 */

import { MetricType, ActiveTemplate } from './types';
import { Task, TaskType } from '@/types/tasks';

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
 * Return type for habit task integration
 */
export interface HabitTaskIntegrationReturn {
  scheduledTasksRef: React.MutableRefObject<Map<string, string>>;
  createHabitTask: (
    habitId: string,
    templateId: string,
    name: string,
    date: string,
    duration?: number,
    options?: HabitTaskOptions
  ) => string | null;
  handleHabitSchedule: (event: any) => string | null;
  handleHabitComplete: (payload: any) => void;
  syncHabitsWithTasks: () => boolean;
  checkForMissingHabitTasks: () => void;
}

/**
 * Progress data structure for habit tasks
 */
export interface HabitTaskProgress {
  value: boolean | number;
  streak: number;
  date: string;
  completed: boolean;
}

/**
 * Map of habit progress by template, habit, and date
 */
export interface HabitProgressMap {
  [templateId: string]: {
    [habitId: string]: {
      [date: string]: HabitTaskProgress;
    };
  };
}
