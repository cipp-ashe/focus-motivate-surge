
import { useEffect, useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { HabitDetail } from '@/components/habits/types';
import { habitTaskOperations } from '@/lib/operations/tasks/habit';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook that handles integration between habits and tasks
 */
export const useHabitTaskIntegration = () => {
  const processingHabitsRef = useRef<Set<string>>(new Set());
  
  // Process habit schedule events
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
  }) => {
    // Skip if already processing this habit
    const habitKey = `${event.habitId}-${event.date}`;
    if (processingHabitsRef.current.has(habitKey)) {
      return;
    }
    
    // Mark as processing
    processingHabitsRef.current.add(habitKey);
    
    try {
      // Check if task already exists
      const existingTask = taskStorage.taskExists(event.habitId, event.date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}`);
        return;
      }
      
      // Create a new habit task
      habitTaskOperations.createHabitTask(
        event.habitId,
        event.templateId,
        event.name,
        event.duration,
        event.date,
        { suppressToast: false }
      );
      
    } finally {
      // Clear processing state after delay
      setTimeout(() => {
        processingHabitsRef.current.delete(habitKey);
      }, 500);
    }
  }, []);
  
  // Check for any habits that should be tasks
  const syncHabitsWithTasks = useCallback(() => {
    // For each habit that should have a task today, ensure the task exists
    const today = new Date().toDateString();
    
    // Emit events to check for pending habits
    eventBus.emit('habits:check-pending', {});
    
    // Force UI update
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 200);
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    // Listen for habit schedule events
    const unsubscribeSchedule = eventBus.on('habit:schedule', handleHabitSchedule);
    
    // Listen for habit complete events
    const unsubscribeComplete = eventBus.on('habit:complete', (event) => {
      // Find task for this habit
      const task = taskStorage.taskExists(event.habitId, event.date || new Date().toDateString());
      
      if (task) {
        // Update task completion status
        eventBus.emit('task:update', {
          taskId: task.id,
          updates: {
            completed: event.completed
          }
        });
      }
    });
    
    // Check for any pending habits that should be tasks
    syncHabitsWithTasks();
    
    // Check periodically
    const intervalId = setInterval(syncHabitsWithTasks, 60000);
    
    return () => {
      unsubscribeSchedule();
      unsubscribeComplete();
      clearInterval(intervalId);
    };
  }, [handleHabitSchedule, syncHabitsWithTasks]);
  
  return {
    syncHabitsWithTasks
  };
};
