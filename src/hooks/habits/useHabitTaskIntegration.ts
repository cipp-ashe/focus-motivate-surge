
import { useEffect, useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task, TaskType } from '@/types/tasks';
import { HabitDetail } from '@/components/habits/types';
import { habitTaskOperations } from '@/lib/operations/tasks/habit';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook that handles integration between habits and tasks
 */
export const useHabitTaskIntegration = () => {
  const processingHabitsRef = useRef<Set<string>>(new Set());
  const syncCountRef = useRef(0);
  const dismissedHabitsRef = useRef<Map<string, string>>(new Map()); // Track dismissed habits for today
  
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
    
    // Skip if this habit was dismissed for today
    if (dismissedHabitsRef.current.has(habitKey)) {
      console.log(`Habit ${event.habitId} was dismissed for ${event.date}, skipping task creation`);
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
  
  // Handle habit task dismissed event
  const handleHabitTaskDismissed = useCallback((event: CustomEvent) => {
    const { habitId, date } = event.detail;
    const habitKey = `${habitId}-${date}`;
    
    console.log(`Marking habit ${habitId} as dismissed for ${date}`);
    dismissedHabitsRef.current.set(habitKey, new Date().toISOString());
    
    // Store dismissed habits in localStorage to persist across sessions
    const dismissedHabits = Object.fromEntries(dismissedHabitsRef.current.entries());
    localStorage.setItem('dismissedHabitTasks', JSON.stringify(dismissedHabits));
    
    // Emit event to mark habit as dismissed in the UI
    eventManager.emit('habit:dismissed', { habitId, date });
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
    console.log("Setting up habit task integration with dismissal handling");
    
    // Load previously dismissed habits from localStorage
    const storedDismissed = localStorage.getItem('dismissedHabitTasks');
    if (storedDismissed) {
      try {
        const dismissed = JSON.parse(storedDismissed);
        dismissedHabitsRef.current = new Map(Object.entries(dismissed));
        
        // Clean up old entries (only keep today's)
        const today = new Date().toDateString();
        Array.from(dismissedHabitsRef.current.keys()).forEach(key => {
          if (!key.includes(today)) {
            dismissedHabitsRef.current.delete(key);
          }
        });
        
        console.log(`Loaded ${dismissedHabitsRef.current.size} dismissed habits for today`);
      } catch (error) {
        console.error('Error loading dismissed habits:', error);
      }
    }
    
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
    
    // Listen for habit task dismissed events
    window.addEventListener('habit-task-dismissed', handleHabitTaskDismissed as EventListener);
    
    // Check for any pending habits that should be tasks
    syncHabitsWithTasks();
    
    // Check periodically
    const intervalId = setInterval(syncHabitsWithTasks, 60000);
    
    return () => {
      unsubscribeSchedule();
      unsubscribeComplete();
      window.removeEventListener('habit-task-dismissed', handleHabitTaskDismissed as EventListener);
      clearInterval(intervalId);
    };
  }, [handleHabitSchedule, syncHabitsWithTasks, handleHabitTaskDismissed]);
  
  return {
    syncHabitsWithTasks
  };
};
