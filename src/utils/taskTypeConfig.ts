import { TaskType } from '@/types/tasks';

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
    description: 'Focus session with countdown timer',
  },
  standard: {
    type: 'standard',
    label: 'Task',
    icon: 'check-circle',
    color: 'text-blue-500 dark:text-blue-400',
    description: 'Standard task',
  },
  journal: {
    type: 'journal',
    label: 'Journal',
    icon: 'book',
    color: 'text-teal-500 dark:text-teal-400',
    description: 'Journal entry or note',
  },
  habit: {
    type: 'habit',
    label: 'Habit',
    icon: 'repeat',
    color: 'text-green-500 dark:text-green-400',
    description: 'Habit tracking',
  },
  recurring: {
    type: 'recurring',
    label: 'Recurring',
    icon: 'calendar',
    color: 'text-indigo-500 dark:text-indigo-400',
    description: 'Recurring task',
  },
  checklist: {
    type: 'checklist',
    label: 'Checklist',
    icon: 'list-checks',
    color: 'text-orange-500 dark:text-orange-400',
    description: 'Task with checklist items',
  },
  project: {
    type: 'project',
    label: 'Project',
    icon: 'folder',
    color: 'text-pink-500 dark:text-pink-400',
    description: 'Project with sub-tasks',
  },
  screenshot: {
    type: 'screenshot',
    label: 'Screenshot',
    icon: 'image',
    color: 'text-cyan-500 dark:text-cyan-400',
    description: 'Task with screenshot',
  },
  voicenote: {
    type: 'voicenote',
    label: 'Voice Note',
    icon: 'mic',
    color: 'text-red-500 dark:text-red-400',
    description: 'Task with voice recording',
  },
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

/**
 * Get the appropriate color class for a task type and element
 * @param type The task type
 * @param element The element type (icon, background, border, button)
 * @returns The appropriate Tailwind color class
 */
export function getTaskColorClass(
  type: TaskType,
  element: 'icon' | 'background' | 'border' | 'button'
): string {
  const baseColor = getTaskTypeConfig(type).color.split(' ')[0].replace('text-', '');

  switch (element) {
    case 'icon':
      return `text-${baseColor} dark:text-${baseColor.replace('-500', '-400')}`;
    case 'background':
      return `bg-${baseColor.replace('-500', '-100')} dark:bg-${baseColor.replace('-500', '-900')}`;
    case 'border':
      return `border-${baseColor.replace('-500', '-300')} dark:border-${baseColor.replace(
        '-500',
        '-700'
      )}`;
    case 'button':
      return `bg-${baseColor.replace('-500', '-100')} hover:bg-${baseColor.replace(
        '-500',
        '-200'
      )} dark:bg-${baseColor.replace('-500', '-900')} dark:hover:bg-${baseColor.replace(
        '-500',
        '-800'
      )}`;
    default:
      return `text-${baseColor} dark:text-${baseColor.replace('-500', '-400')}`;
  }
}

/**
 * Array of task type definitions for use in UI components
 */
export const TASK_TYPE_DEFINITIONS = Object.values(taskTypeConfigs);
