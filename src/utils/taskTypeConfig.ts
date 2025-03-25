
import React from 'react';
import { CheckSquare, Clock, Image, FileText, Mic, Zap } from 'lucide-react';
import { TaskType } from '@/types/tasks';

/**
 * Centralized configuration for task types
 * This serves as a single source of truth for task type definitions
 * including their icons, labels, and color schemes
 */
export type TaskTypeDefinition = {
  type: TaskType;
  icon: React.ReactNode;
  label: string;
  color: {
    icon: string;
    background: string;
    border: string;
    button: string;
  };
};

/**
 * Task type definitions with consistent styling
 */
export const TASK_TYPE_DEFINITIONS: TaskTypeDefinition[] = [
  {
    type: 'standard',
    icon: <CheckSquare className="h-4 w-4" />,
    label: 'Task',
    color: {
      icon: 'text-slate-500 dark:text-slate-400',
      background: 'bg-slate-100/50 dark:bg-slate-900/20',
      border: 'border-slate-300/50 dark:border-slate-600/40',
      button: 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700'
    }
  },
  {
    type: 'timer',
    icon: <Clock className="h-4 w-4" />,
    label: 'Timer',
    color: {
      icon: 'text-purple-500 dark:text-purple-400',
      background: 'bg-purple-100/50 dark:bg-purple-900/20',
      border: 'border-purple-400/50 dark:border-purple-500/40',
      button: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700'
    }
  },
  {
    type: 'screenshot',
    icon: <Image className="h-4 w-4" />,
    label: 'Screenshot',
    color: {
      icon: 'text-blue-500 dark:text-blue-400',
      background: 'bg-blue-100/50 dark:bg-blue-900/20',
      border: 'border-blue-400/50 dark:border-blue-500/40',
      button: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
    }
  },
  {
    type: 'journal',
    icon: <FileText className="h-4 w-4" />,
    label: 'Journal',
    color: {
      icon: 'text-amber-500 dark:text-amber-400',
      background: 'bg-amber-100/50 dark:bg-amber-900/20',
      border: 'border-amber-400/50 dark:border-amber-500/40',
      button: 'bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700'
    }
  },
  {
    type: 'voicenote',
    icon: <Mic className="h-4 w-4" />,
    label: 'Voice',
    color: {
      icon: 'text-rose-500 dark:text-rose-400',
      background: 'bg-rose-100/50 dark:bg-rose-900/20',
      border: 'border-rose-400/50 dark:border-rose-500/40',
      button: 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700'
    }
  },
  {
    type: 'checklist',
    icon: <CheckSquare className="h-4 w-4" />,
    label: 'Checklist',
    color: {
      icon: 'text-cyan-500 dark:text-cyan-400',
      background: 'bg-cyan-100/50 dark:bg-cyan-900/20',
      border: 'border-cyan-400/50 dark:border-cyan-500/40',
      button: 'bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700'
    }
  },
  {
    type: 'habit',
    icon: <Zap className="h-4 w-4" />,
    label: 'Habit',
    color: {
      icon: 'text-emerald-500 dark:text-emerald-400',
      background: 'bg-emerald-100/50 dark:bg-emerald-900/20',
      border: 'border-emerald-400/50 dark:border-emerald-500/40',
      button: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'
    }
  }
];

/**
 * Get task type definition by type
 */
export const getTaskTypeDefinition = (type: TaskType = 'standard'): TaskTypeDefinition => {
  return TASK_TYPE_DEFINITIONS.find(def => def.type === type) || TASK_TYPE_DEFINITIONS[0];
};

/**
 * Get task icon by type
 */
export const getTaskIcon = (type: TaskType = 'standard'): React.ReactNode => {
  return getTaskTypeDefinition(type).icon;
};

/**
 * Get task label by type
 */
export const getTaskLabel = (type: TaskType = 'standard'): string => {
  return getTaskTypeDefinition(type).label;
};

/**
 * Get task color classes by type and variant
 */
export const getTaskColorClass = (
  type: TaskType = 'standard', 
  variant: 'icon' | 'background' | 'border' | 'button' = 'icon'
): string => {
  return getTaskTypeDefinition(type).color[variant];
};
