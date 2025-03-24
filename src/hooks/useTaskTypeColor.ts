
/**
 * Hook to get color based on task type
 */
export function useTaskTypeColor(taskType?: string): string {
  // Default colors for each task type
  switch (taskType) {
    case 'personal':
      return 'rgba(var(--color-purple-500), 0.5)';
    case 'work':
      return 'rgba(var(--color-blue-500), 0.5)';
    case 'urgent':
      return 'rgba(var(--color-red-500), 0.5)';
    case 'important':
      return 'rgba(var(--color-orange-500), 0.5)';
    case 'focus':
      return 'rgba(var(--color-green-500), 0.5)';
    case 'timer':
      return 'rgba(var(--color-teal-500), 0.5)';
    case 'habit':
      return 'rgba(var(--color-indigo-500), 0.5)';
    case 'checklist':
      return 'rgba(var(--color-yellow-500), 0.5)';
    case 'recurring':
      return 'rgba(var(--color-cyan-500), 0.5)';
    case 'scheduled':
      return 'rgba(var(--color-pink-500), 0.5)';
    default:
      return 'rgba(var(--color-gray-500), 0.5)';
  }
}
