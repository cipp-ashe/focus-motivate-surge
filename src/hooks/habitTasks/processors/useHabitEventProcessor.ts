
import { useCallback } from 'react';

/**
 * Hook for processing habit event data
 */
export const useHabitEventProcessor = () => {
  /**
   * Process and validate habit schedule event data
   */
  const processHabitScheduleEvent = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Validate required fields
    if (!event.habitId || !event.name || !event.date) {
      console.error('Invalid habit schedule event data', event);
      return null;
    }
    
    // Handle missing duration
    if (!event.duration || event.duration <= 0) {
      console.log(`Using default duration for habit ${event.name}`);
      return {
        ...event,
        duration: 1500 // Default to 25 minutes
      };
    }
    
    // Return validated event data
    return event;
  }, []);
  
  return { processHabitScheduleEvent };
};
