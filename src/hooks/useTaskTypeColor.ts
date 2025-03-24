
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
        return 'text-[hsl(var(--timer))] dark:text-[hsl(var(--timer))]';
      case 'journal':
        return 'text-[hsl(var(--journal))] dark:text-[hsl(var(--journal))]';
      case 'checklist':
        return 'text-[hsl(var(--checklist))] dark:text-[hsl(var(--checklist))]';
      case 'screenshot':
        return 'text-[hsl(var(--screenshot))] dark:text-[hsl(var(--screenshot))]';
      case 'voicenote':
        return 'text-[hsl(var(--voicenote))] dark:text-[hsl(var(--voicenote))]';
      case 'focus':
        return 'text-[hsl(var(--focus))] dark:text-[hsl(var(--focus))]';
      case 'habit':
        return 'text-purple-500 dark:text-purple-400';
      case 'regular':
      case 'standard':
      default:
        return 'text-[hsl(var(--regular))] dark:text-[hsl(var(--regular))]';
    }
  };

  /**
   * Get the appropriate background color class for task type
   */
  const getBackgroundColorClass = (type: TaskType = 'regular'): string => {
    switch (type) {
      case 'timer':
        return 'bg-[hsla(var(--timer),0.1)] dark:bg-[hsla(var(--timer),0.05)]';
      case 'journal':
        return 'bg-[hsla(var(--journal),0.1)] dark:bg-[hsla(var(--journal),0.05)]';
      case 'checklist':
        return 'bg-[hsla(var(--checklist),0.1)] dark:bg-[hsla(var(--checklist),0.05)]';
      case 'screenshot':
        return 'bg-[hsla(var(--screenshot),0.1)] dark:bg-[hsla(var(--screenshot),0.05)]';
      case 'voicenote':
        return 'bg-[hsla(var(--voicenote),0.1)] dark:bg-[hsla(var(--voicenote),0.05)]';
      case 'focus':
        return 'bg-[hsla(var(--focus),0.1)] dark:bg-[hsla(var(--focus),0.05)]';
      case 'habit':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'regular':
      case 'standard':
      default:
        return 'bg-[hsla(var(--regular),0.1)] dark:bg-[hsla(var(--regular),0.05)]';
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
      case 'standard':
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
