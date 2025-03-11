
import { TaskType } from '@/types/tasks';

/**
 * Hook for determining the appropriate task type based on habit metadata
 */
export const useTaskTypeProcessor = () => {
  /**
   * Checks if a taskType is valid according to the TaskType enum
   */
  const isValidTaskType = (taskType: string): taskType is TaskType => {
    const validTypes: TaskType[] = ['timer', 'regular', 'screenshot', 'journal', 'checklist', 'voicenote'];
    return validTypes.includes(taskType as TaskType);
  };
  
  /**
   * Determines the appropriate task type from habit metric type and name
   * 
   * @param taskType - Optional explicit task type to use
   * @param metricType - The habit metric type
   * @param habitName - The habit name for context-based detection
   * @returns The determined TaskType
   */
  const determineTaskType = (taskType?: TaskType, metricType?: string, habitName?: string): TaskType => {
    // If a specific task type is provided and it's valid, use it
    if (taskType && isValidTaskType(taskType)) {
      return taskType;
    }
    
    console.log(`Determining task type from metric type: ${metricType} and name: ${habitName}`);
    
    // First check if the habit name indicates a journal task
    if (habitName) {
      const nameLower = habitName.toLowerCase();
      if (nameLower.includes('journal') || 
          nameLower.includes('gratitude') || 
          nameLower.includes('diary') ||
          nameLower.includes('reflect')) {
        console.log(`Detected journal task from name: ${habitName}`);
        return 'journal';
      }
    }
    
    // Aligned mapping between metric types and task types
    switch (metricType) {
      case 'timer':
        return 'timer';
      case 'journal':
        return 'journal';
      case 'boolean':
      case 'counter':
      case 'rating':
        // Map these to regular tasks
        return 'regular';
      case 'checklist':
      case 'todo':
        return 'checklist';
      case 'voicenote':
      case 'audio':
        return 'voicenote';
      case 'screenshot':
        return 'screenshot';
      default:
        return 'regular';
    }
  };
  
  return {
    isValidTaskType,
    determineTaskType
  };
};
