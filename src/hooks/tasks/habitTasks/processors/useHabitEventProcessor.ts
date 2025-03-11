
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for processing and validating habit schedule events
 */
export const useHabitEventProcessor = () => {
  /**
   * Processes and validates habit schedule events
   * 
   * @param event - The habit schedule event data
   * @returns The validated event data or null if invalid
   */
  const processHabitScheduleEvent = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Validate the event data
    if (!event.habitId || !event.name || !event.date) {
      console.error('Invalid habit schedule event:', event);
      return null;
    }
    
    // Add robust logging for debugging
    console.log(`Processing habit schedule event for ${event.name} (${event.habitId}), templateId: ${event.templateId}, metricType: ${event.metricType}`);
    
    // Create a copy of the event to modify
    const validatedEvent = { ...event };
    
    // Ensure date format is correct - expect string format like "Sun Mar 09 2025"
    if (typeof event.date !== 'string' || event.date.split(' ').length !== 4) {
      // Try to fix the date format if it's incorrect
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
        validatedEvent.date = dateObj.toDateString();
        console.log(`Corrected date format to: ${validatedEvent.date}`);
      } else {
        console.error('Invalid date format in habit schedule event:', event.date);
        toast.error('Failed to schedule habit: invalid date format');
        return null;
      }
    }
    
    // Ensure duration is valid
    if (!event.duration || typeof event.duration !== 'number' || event.duration <= 0) {
      validatedEvent.duration = 1500; // Default to 25 minutes
      console.log(`Using default duration (1500 seconds) for habit ${event.habitId}`);
    }
    
    // Check template ID exists
    if (!event.templateId) {
      console.warn(`No templateId provided for habit ${event.habitId}, using 'custom' as default`);
      validatedEvent.templateId = 'custom';
    }
    
    return validatedEvent;
  }, []);
  
  return {
    processHabitScheduleEvent
  };
};
