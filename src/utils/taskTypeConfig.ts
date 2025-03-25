
import { TaskType } from '@/types/timer/models';

export interface TaskTypeConfig {
  type: TaskType;
  label: string;
  icon: string; // Icon name
  color: string; // Tailwind color class
  description: string;
}

export const taskTypeConfigs: Record<TaskType, TaskTypeConfig> = {
  timer: {
    type: 'timer',
    label: 'Timer',
    icon: 'clock',
    color: 'text-purple-500 dark:text-purple-400',
    description: 'Focus session with countdown timer'
  },
  focus: {
    type: 'focus',
    label: 'Focus',
    icon: 'zap',
    color: 'text-amber-500 dark:text-amber-400',
    description: 'Deep work session'
  },
  standard: {
    type: 'standard',
    label: 'Task',
    icon: 'check-circle',
    color: 'text-blue-500 dark:text-blue-400',
    description: 'Standard task'
  },
  journal: {
    type: 'journal',
    label: 'Journal',
    icon: 'book',
    color: 'text-teal-500 dark:text-teal-400',
    description: 'Journal entry or note'
  },
  habit: {
    type: 'habit',
    label: 'Habit',
    icon: 'repeat',
    color: 'text-green-500 dark:text-green-400',
    description: 'Habit tracking'
  },
  recurring: {
    type: 'recurring',
    label: 'Recurring',
    icon: 'calendar',
    color: 'text-indigo-500 dark:text-indigo-400',
    description: 'Recurring task'
  },
  checklist: {
    type: 'checklist',
    label: 'Checklist',
    icon: 'list-checks',
    color: 'text-orange-500 dark:text-orange-400',
    description: 'Task with checklist items'
  },
  project: {
    type: 'project',
    label: 'Project',
    icon: 'folder',
    color: 'text-pink-500 dark:text-pink-400',
    description: 'Project with sub-tasks'
  },
  screenshot: {
    type: 'screenshot',
    label: 'Screenshot',
    icon: 'image',
    color: 'text-cyan-500 dark:text-cyan-400',
    description: 'Task with screenshot'
  },
  voicenote: {
    type: 'voicenote',
    label: 'Voice Note',
    icon: 'mic',
    color: 'text-red-500 dark:text-red-400',
    description: 'Task with voice recording'
  }
};

export function getTaskTypeConfig(type: TaskType): TaskTypeConfig {
  return taskTypeConfigs[type] || taskTypeConfigs.standard;
}

export function getTaskTypeLabel(type: TaskType): string {
  return taskTypeConfigs[type]?.label || 'Task';
}

export function getTaskTypeIcon(type: TaskType): string {
  return taskTypeConfigs[type]?.icon || 'check-circle';
}

export function getTaskTypeColor(type: TaskType): string {
  return taskTypeConfigs[type]?.color || 'text-blue-500 dark:text-blue-400';
}
