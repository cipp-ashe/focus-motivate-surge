
import { useCallback } from 'react';
import { TaskType } from '@/types/tasks';

/**
 * Hook for processing and determining task types
 */
export const useTaskTypeProcessor = () => {
  /**
   * Determine the appropriate task type based on various inputs
   */
  const determineTaskType = useCallback((
    specifiedType?: TaskType,
    metricType?: string,
    habitName?: string
  ): TaskType => {
    // First, if a valid task type is explicitly specified, use it
    if (specifiedType && isValidTaskType(specifiedType)) {
      return specifiedType;
    }
    
    // Check if this is a journal by metric type
    if (metricType === 'journal') {
      return 'journal';
    }
    
    // Check if this is a timer by metric type
    if (metricType === 'timer') {
      return 'timer';
    }
    
    // If we have a habit name, try to determine from it
    if (habitName) {
      const nameLower = habitName.toLowerCase();
      
      // Check for journal-related keywords
      if (
        nameLower.includes('journal') || 
        nameLower.includes('gratitude') || 
        nameLower.includes('diary') ||
        nameLower.includes('reflect')
      ) {
        return 'journal';
      }
      
      // Check for timer-related keywords
      if (
        nameLower.includes('meditation') || 
        nameLower.includes('workout') || 
        nameLower.includes('exercise') ||
        nameLower.includes('run') ||
        nameLower.includes('practice')
      ) {
        return 'timer';
      }
    }
    
    // Default to regular task type
    return 'regular';
  }, []);
  
  /**
   * Validate if a task type is valid
   */
  const isValidTaskType = useCallback((taskType: string): boolean => {
    const validTypes = ['timer', 'regular', 'journal', 'checklist'];
    return validTypes.includes(taskType);
  }, []);
  
  return {
    determineTaskType,
    isValidTaskType
  };
};
