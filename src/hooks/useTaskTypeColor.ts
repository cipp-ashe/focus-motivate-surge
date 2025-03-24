
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
        return 'task-icon-timer';
      case 'journal':
        return 'task-icon-journal';
      case 'checklist':
        return 'task-icon-checklist';
      case 'screenshot':
        return 'task-icon-screenshot';
      case 'voicenote':
        return 'task-icon-voicenote';
      case 'focus':
        return 'task-icon-focus';
      case 'habit':
        return 'task-icon-habit text-purple-500';
      case 'regular':
      default:
        return 'task-icon-regular';
    }
  };

  /**
   * Get the appropriate background color class for task type
   */
  const getBackgroundColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'task-bg-timer';
      case 'journal':
        return 'task-bg-journal';
      case 'checklist':
        return 'task-bg-checklist';
      case 'screenshot':
        return 'task-bg-screenshot';
      case 'voicenote':
        return 'task-bg-voicenote';
      case 'focus':
        return 'task-bg-focus';
      case 'habit':
        return 'task-bg-habit bg-purple-100 dark:bg-purple-900/20';
      case 'regular':
      default:
        return 'task-bg-regular';
    }
  };

  /**
   * Get the appropriate border color class for task type
   */
  const getBorderColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'border-[hsl(var(--timer))]';
      case 'journal':
        return 'border-[hsl(var(--journal))]';
      case 'checklist':
        return 'border-[hsl(var(--checklist))]';
      case 'screenshot':
        return 'border-[hsl(var(--screenshot))]';
      case 'voicenote':
        return 'border-[hsl(var(--voicenote))]';
      case 'focus':
        return 'border-[hsl(var(--focus))]';
      case 'habit':
        return 'border-purple-300 dark:border-purple-800';
      case 'regular':
      default:
        return 'border-[hsl(var(--regular))]';
    }
  };

  return {
    getIconColorClass,
    getBackgroundColorClass,
    getBorderColorClass
  };
}
