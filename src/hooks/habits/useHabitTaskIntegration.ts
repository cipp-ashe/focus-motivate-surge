
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
  const syncCountRef = useRef(0);
  
  // Process habit schedule events
  const handleHabitSchedule = useCallback((event: {
    habitId: string;
    templateId: string;
    name: string;
    duration: number;
    date: string;
    metricType?: string;
  }) => {
    // Skip if already processing this habit
    const habitKey = `${event.habitId}-${event.date}`;
    if (processingHabitsRef.current.has(habitKey)) {
      console.log(`Already processing habit ${event.habitId} for ${event.date}, skipping`);
      return;
    }
    
    // Mark as processing
    processingHabitsRef.current.add(habitKey);
    console.log(`Processing habit schedule: ${event.name} (${event.habitId}) from template ${event.templateId}`);
    
    try {
      // Check if task already exists
      const existingTask = taskStorage.taskExists(event.habitId, event.date);
      
      if (existingTask) {
        console.log(`Task already exists for habit ${event.habitId} on ${event.date}`);
        
        // Make sure the task is in memory too by emitting an event
        eventBus.emit('task:create', existingTask);
        return;
      }
      
      // Determine the appropriate task type based on habit name and metric type
      let taskType = 'regular';
      
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
      
      console.log(`Creating new habit task for ${event.name} with type ${taskType}`);
      const result = habitTaskOperations.createHabitTask(
        event.habitId,
        event.templateId,
        event.name,
        event.duration,
        event.date,
        { 
          suppressToast: false,
          taskType: taskType
        }
      );
      
      console.log(`Task creation result: ${result ? 'success' : 'failed'}`);
      
      // Force a UI update
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
      }, 300);
      
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
    const syncId = ++syncCountRef.current;
    
    console.log(`[Sync #${syncId}] Starting habit-task synchronization for ${today}`);
    
    // Emit events to check for pending habits
    eventBus.emit('habits:check-pending', {});
    
    // Load all tasks to check what exists
    const allTasks = taskStorage.loadTasks();
    const habitTasks = allTasks.filter(task => task.relationships?.habitId);
    
    console.log(`[Sync #${syncId}] Found ${habitTasks.length} habit tasks in storage`);
    
    // Load task list again after a delay for verification
    setTimeout(() => {
      const verifyTasks = taskStorage.loadTasks();
      const verifyHabitTasks = verifyTasks.filter(task => task.relationships?.habitId);
      
      console.log(`[Sync #${syncId}] Verification: Found ${verifyHabitTasks.length} habit tasks in storage`);
      
      // Force UI update
      window.dispatchEvent(new Event('force-task-update'));
    }, 500);
    
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    console.log("Setting up habit task integration");
    
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
