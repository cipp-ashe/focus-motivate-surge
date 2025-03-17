
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task, TaskType } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useDismissalHandler } from './taskIntegration/useDismissalHandler';
import { useSyncHandler } from './taskIntegration/useSyncHandler';
import { useVerificationHandler } from './taskIntegration/useVerificationHandler';

/**
 * Hook that handles integration between habits and tasks
 */
export const useHabitTaskIntegration = () => {
  // Use the specialized handlers
  const {
    loadDismissedHabits,
    isHabitDismissed,
    handleHabitTaskDismissed
  } = useDismissalHandler();
  
  const {
    syncHabitsWithTasks,
    processHabitSchedule
  } = useSyncHandler();
  
  const {
    createHabitTask
  } = useVerificationHandler();
  
  // Process habit schedule events
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Pre-process the event, checking for dismissed or already processing habits
    const processedEvent = processHabitSchedule(event, isHabitDismissed);
    if (!processedEvent) {
      return;
    }
    
    console.log(`Processing habit schedule: ${event.name} (${event.habitId}) from template ${event.templateId}`);
    
    // Determine the appropriate task type based on habit name and metric type
    let taskType: TaskType = 'regular';
    
    // Check if this is a journal by name
    const nameLower = event.name.toLowerCase();
    if (nameLower.includes('journal') || 
        nameLower.includes('gratitude') || 
        nameLower.includes('diary') ||
        nameLower.includes('reflect')) {
      taskType = 'journal';
    } 
    // Or check by metric type
    else if (event.metricType === 'timer') {
      taskType = 'timer';
    } else if (event.metricType === 'journal') {
      taskType = 'journal';
    }
    
    // Create the task with the appropriate type
    createHabitTask(event, taskType);
  }, [processHabitSchedule, isHabitDismissed, createHabitTask]);
  
  // Set up event listeners
  useEffect(() => {
    console.log("Setting up habit task integration with dismissal handling");
    
    // Load previously dismissed habits
    loadDismissedHabits();
    
    // Listen for habit schedule events
    // @ts-ignore - We're using a custom event type not in TimerEventPayloads
    const unsubscribeSchedule = eventManager.on('habit:schedule', handleHabitSchedule);
    
    // Listen for habit complete events using custom events
    // Instead of using eventBus directly, we'll use the DOM event system
    const handleHabitComplete = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      // Find task for this habit
      const task = taskStorage.taskExists(detail.habitId, detail.date || new Date().toDateString());
      
      if (task) {
        // Update task completion status
        eventManager.emit('task:update', {
          taskId: task.id,
          updates: {
            completed: detail.completed
          }
        });
      }
    };
    
    // Add DOM event listener
    window.addEventListener('habit-complete', handleHabitComplete);
    
    // Listen for habit task dismissed events
    window.addEventListener('habit-task-dismissed', handleHabitTaskDismissed as EventListener);
    
    // Check for any pending habits that should be tasks
    syncHabitsWithTasks();
    
    // Check periodically
    const intervalId = setInterval(syncHabitsWithTasks, 60000);
    
    return () => {
      unsubscribeSchedule();
      window.removeEventListener('habit-complete', handleHabitComplete);
      window.removeEventListener('habit-task-dismissed', handleHabitTaskDismissed as EventListener);
      clearInterval(intervalId);
    };
  }, [handleHabitSchedule, syncHabitsWithTasks, handleHabitTaskDismissed, loadDismissedHabits]);
  
  return {
    syncHabitsWithTasks
  };
};
