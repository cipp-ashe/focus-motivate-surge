
import { useCallback, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitTaskCreator } from './useHabitTaskCreator';
import { useTaskTypeProcessor } from './processors/useTaskTypeProcessor';
import { useHabitEventProcessor } from './processors/useHabitEventProcessor';
import { useTaskCreationProcessor } from './processors/useTaskCreationProcessor';
import { usePendingTaskProcessor } from './processors/usePendingTaskProcessor';
import { useEvent } from '@/hooks/useEvent';
import { AllEventTypes, EventPayloads } from '@/types/events';

// Define proper types for the habit schedule event
type HabitScheduleEvent = EventPayloads['habit:schedule'];

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
  }, []);
  
  // Handle habit schedule events with correct typing
  useEvent('habit:schedule', (event: HabitScheduleEvent) => {
    handleHabitSchedule(event);
  });
  
  // Handle check pending events
  useEvent('habits:check-pending', () => {
    processPendingTasks();
  });
  
  // Handle habit schedule events with prioritization
  const handleHabitSchedule = useCallback((event: HabitScheduleEvent) => {
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
