import { TaskType } from '@/types/tasks';
import { getTaskColorClass } from '@/utils/taskTypeConfig';

/**
 * Hook to get color classes for task types
 * Returns tailwind classes for different task visualizations
 *
 * This is now a wrapper around our centralized configuration
 * to maintain backward compatibility
 */
export function useTaskTypeColor() {
  /**
   * Get the appropriate color class for the task icon based on task type
   */
  const getIconColorClass = (type: TaskType = 'standard'): string => {
    // Use CSS variables for task type colors instead of hardcoded Tailwind classes
    return `task-icon-${type}`;
  };

  /**
   * Get the appropriate background color class for task type
   */
  const getBackgroundColorClass = (type: TaskType = 'standard'): string => {
    // Use CSS variables for task type colors instead of hardcoded Tailwind classes
    return `task-bg-${type}`;
  };

  /**
   * Get the appropriate border color class for task type
   */
  const getBorderColorClass = (type: TaskType = 'standard'): string => {
    // Use CSS variables for task type colors instead of hardcoded Tailwind classes
    return `task-border-${type}`;
  };

  /**
   * Get the appropriate button background color class for task type
   */
  const getButtonColorClass = (type: TaskType = 'standard'): string => {
    // Use CSS variables for task type colors instead of hardcoded Tailwind classes
    return `task-button-${type}`;
  };

  return {
    getIconColorClass,
    getBackgroundColorClass,
    getBorderColorClass,
    getButtonColorClass,
  };
}
