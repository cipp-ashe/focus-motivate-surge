
import { useCallback, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { useTaskTypeProcessor } from './processors/useTaskTypeProcessor';
import { useHabitEventProcessor } from './processors/useHabitEventProcessor';
import { useTaskCreationProcessor } from './processors/useTaskCreationProcessor';
import { usePendingTaskProcessor } from './processors/usePendingTaskProcessor';
import { useEvent } from '@/hooks/useEvent';

/**
 * Hook for processing habit tasks with improved localStorage synchronization,
 * error handling, and debouncing
 */
export const useHabitTaskProcessor = () => {
  const { createHabitTask } = useHabitTaskCreator();
  const { determineTaskType } = useTaskTypeProcessor();
  const { processHabitScheduleEvent } = useHabitEventProcessor();
  const { processHabitTask } = useTaskCreationProcessor(createHabitTask);
  const { processPendingTasks } = usePendingTaskProcessor();
  
  // Set up event listeners with the new event system
  useEffect(() => {
    console.log("useHabitTaskProcessor: Setting up event listeners");
    
    // No cleanup needed for event listeners as they're handled by useEvent
  }, []);
  
  // Handle habit schedule events
  useEvent('habit:schedule', (event) => {
    handleHabitSchedule(event);
  });
  
  // Handle check pending events
  useEvent('habits:check-pending', () => {
    processPendingTasks();
  });
  
  // Handle habit schedule events from the event bus with prioritization
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Process and validate the event data
    const validatedEvent = processHabitScheduleEvent(event);
    
    // If validation failed, skip processing
    if (!validatedEvent) {
      return;
    }
    
    // Pass validated event to processor
    processHabitTask(validatedEvent);
  }, [processHabitScheduleEvent, processHabitTask]);
  
  return { 
    processHabitTask,
    handleHabitSchedule,
    processPendingTasks
  };
};
