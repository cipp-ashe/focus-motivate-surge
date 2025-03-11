
import { useCallback, useRef } from 'react';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';

/**
 * Hook for synchronizing habits with tasks
 */
export const useSyncHandler = () => {
  const syncCountRef = useRef(0);
  const processingHabitsRef = useRef<Set<string>>(new Set());
  
  /**
   * Check if we're already processing a specific habit
   */
  const isProcessingHabit = useCallback((habitId: string, date: string) => {
    const habitKey = `${habitId}-${date}`;
    return processingHabitsRef.current.has(habitKey);
  }, []);
  
  /**
   * Mark a habit as being processed
   */
  const markHabitProcessing = useCallback((habitId: string, date: string) => {
    const habitKey = `${habitId}-${date}`;
    processingHabitsRef.current.add(habitKey);
    
    // Auto-clear after a delay
    setTimeout(() => {
      processingHabitsRef.current.delete(habitKey);
    }, 500);
  }, []);
  
  /**
   * Check for any habits that should be tasks
   */
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
  
  /**
   * Process a habit schedule event, with handling for already processing or dismissed habits
   */
  const processHabitSchedule = useCallback((
    event: {
      habitId: string;
      templateId: string;
      name: string;
      duration: number;
      date: string;
      metricType?: string;
    }, 
    isHabitDismissed: (habitId: string, date: string) => boolean
  ) => {
    // Skip if already processing this habit
    const habitKey = `${event.habitId}-${event.date}`;
    if (isProcessingHabit(event.habitId, event.date)) {
      console.log(`Already processing habit ${event.habitId} for ${event.date}, skipping`);
      return;
    }
    
    // Skip if this habit was dismissed for today
    if (isHabitDismissed(event.habitId, event.date)) {
      console.log(`Habit ${event.habitId} was dismissed for ${event.date}, skipping task creation`);
      return;
    }
    
    // Mark as processing
    markHabitProcessing(event.habitId, event.date);
    
    return event;
  }, [isProcessingHabit, markHabitProcessing]);
  
  return {
    syncHabitsWithTasks,
    processHabitSchedule,
    isProcessingHabit,
    markHabitProcessing
  };
};
