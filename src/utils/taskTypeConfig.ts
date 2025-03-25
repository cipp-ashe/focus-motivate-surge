
import { Clipboard, Timer, Image, BookOpen, CheckSquare, Folder, PenTool, LayoutGrid } from 'lucide-react';
import { TaskType, TaskStatus } from '@/types/tasks';

// Task type color configuration
export const TASK_TYPE_DEFINITIONS = {
  standard: {
    icon: Clipboard,
    label: 'Task',
    description: 'Standard task',
    color: 'blue'
  },
  timer: {
    icon: Timer,
    label: 'Timer',
    description: 'Timer task',
    color: 'purple'
  },
  screenshot: {
    icon: Image,
    label: 'Screenshot',
    description: 'Screenshot task',
    color: 'green'
  },
  journal: {
    icon: BookOpen,
    label: 'Journal',
    description: 'Journal task',
    color: 'teal'
  },
  checklist: {
    icon: CheckSquare,
    label: 'Checklist',
    description: 'Checklist task',
    color: 'amber'
  },
  project: {
    icon: Folder,
    label: 'Project',
    description: 'Project task',
    color: 'indigo'
  },
  voicenote: {
    icon: PenTool,
    label: 'Voice Note',
    description: 'Voice note task',
    color: 'red'
  },
  habit: {
    icon: LayoutGrid,
    label: 'Habit',
    description: 'Habit task',
    color: 'emerald'
  },
  focus: {
    icon: Timer,
    label: 'Focus',
    description: 'Focus task',
    color: 'purple'
  },
  recurring: {
    icon: LayoutGrid,
    label: 'Recurring',
    description: 'Recurring task',
    color: 'sky'
  }
};

// Helper functions
export const getTaskIcon = (taskType: TaskType = 'standard') => {
  return TASK_TYPE_DEFINITIONS[taskType]?.icon || TASK_TYPE_DEFINITIONS.standard.icon;
};

export const getTaskTypeLabel = (taskType: TaskType = 'standard') => {
  return TASK_TYPE_DEFINITIONS[taskType]?.label || TASK_TYPE_DEFINITIONS.standard.label;
};

export const getTaskTypeIcon = (taskType: TaskType = 'standard') => {
  return TASK_TYPE_DEFINITIONS[taskType]?.icon || TASK_TYPE_DEFINITIONS.standard.icon;
};

export const getTaskColorClass = (taskType: TaskType = 'standard') => {
  const color = TASK_TYPE_DEFINITIONS[taskType]?.color || 'blue';
  return {
    textColor: `text-${color}-600 dark:text-${color}-400`,
    bgColor: `bg-${color}-100 dark:bg-${color}-950/50`,
    borderColor: `border-${color}-200 dark:border-${color}-800`,
    hoverBg: `hover:bg-${color}-200 dark:hover:bg-${color}-900/50`,
    accentColor: `text-${color}-700 dark:text-${color}-300`
  };
};

// Task status helpers
export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400';
    case 'in-progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'canceled':
      return 'text-red-600 dark:text-red-400';
    case 'on-hold':
      return 'text-amber-600 dark:text-amber-400';
    case 'started':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'delayed':
      return 'text-orange-600 dark:text-orange-400';
    default:
      return 'text-slate-600 dark:text-slate-400';
  }
};

// Get task type definition - for backwards compatibility
export const getTaskTypeDefinition = (taskType: TaskType = 'standard') => {
  return TASK_TYPE_DEFINITIONS[taskType] || TASK_TYPE_DEFINITIONS.standard;
};
