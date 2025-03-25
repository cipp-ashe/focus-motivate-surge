
import { TaskType } from '@/types/tasks';

/**
 * Hook to get color classes for task types
 * Returns tailwind classes for different task visualizations
 */
export function useTaskTypeColor() {
  /**
   * Get the appropriate color class for the task icon based on task type
   */
  const getIconColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'text-purple-500 dark:text-purple-400';
      case 'journal':
        return 'text-amber-500 dark:text-amber-400';
      case 'checklist':
        return 'text-emerald-500 dark:text-emerald-400';
      case 'screenshot':
        return 'text-blue-500 dark:text-blue-400';
      case 'voicenote':
        return 'text-rose-500 dark:text-rose-400';
      case 'focus':
        return 'text-cyan-500 dark:text-cyan-400';
      case 'habit':
        return 'text-indigo-500 dark:text-indigo-400';
      case 'regular':
      case 'standard':
      default:
        return 'text-slate-500 dark:text-slate-400';
    }
  };

  /**
   * Get the appropriate background color class for task type
   */
  const getBackgroundColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'bg-purple-100/50 dark:bg-purple-900/20';
      case 'journal':
        return 'bg-amber-100/50 dark:bg-amber-900/20';
      case 'checklist':
        return 'bg-emerald-100/50 dark:bg-emerald-900/20';
      case 'screenshot':
        return 'bg-blue-100/50 dark:bg-blue-900/20';
      case 'voicenote':
        return 'bg-rose-100/50 dark:bg-rose-900/20';
      case 'focus':
        return 'bg-cyan-100/50 dark:bg-cyan-900/20';
      case 'habit':
        return 'bg-indigo-100/50 dark:bg-indigo-900/20';
      case 'regular':
      case 'standard':
      default:
        return 'bg-slate-100/50 dark:bg-slate-900/20';
    }
  };

  /**
   * Get the appropriate border color class for task type
   */
  const getBorderColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'border-purple-400/50 dark:border-purple-500/40';
      case 'journal':
        return 'border-amber-400/50 dark:border-amber-500/40';
      case 'checklist':
        return 'border-emerald-400/50 dark:border-emerald-500/40';
      case 'screenshot':
        return 'border-blue-400/50 dark:border-blue-500/40';
      case 'voicenote':
        return 'border-rose-400/50 dark:border-rose-500/40';
      case 'focus':
        return 'border-cyan-400/50 dark:border-cyan-500/40';
      case 'habit':
        return 'border-indigo-400/50 dark:border-indigo-500/40';
      case 'regular':
      case 'standard':
      default:
        return 'border-slate-300/50 dark:border-slate-600/40';
    }
  };

  return {
    getIconColorClass,
    getBackgroundColorClass,
    getBorderColorClass
  };
}
