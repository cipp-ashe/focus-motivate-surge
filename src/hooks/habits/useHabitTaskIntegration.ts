
import { useCallback, useState, useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { useEvent } from '@/hooks/useEvent';
import { Task } from '@/types/tasks';
import { HabitTaskEvent } from '@/types/events/unified';
import { taskOperations } from '@/lib/operations/tasks';

/**
 * Hook for integrating habits with tasks
 */
export const useHabitTaskIntegration = () => {
  const [scheduledTasks, setScheduledTasks] = useState<Map<string, string>>(new Map());
  
  // Handle habit scheduling (create tasks for habits)
  const handleHabitSchedule = useCallback((event: HabitTaskEvent) => {
    const { habitId, templateId, name, duration, date, metricType } = event;
    
    // Generate a key for this habit-date combination
    const key = `${habitId}-${date}`;
    
    // Skip if we've already processed this combination
    if (scheduledTasks.has(key)) {
      console.log(`Already scheduled habit task for ${name} on ${date}`);
      return scheduledTasks.get(key);
    }
    
    // Create the task using the operations API
    console.log(`Creating habit task for ${name}`);
    const taskId = taskOperations.createHabitTask(
      habitId,
      templateId,
      name,
      duration,
      date,
      {
        metricType,
        suppressToast: true
      }
    );
    
    if (taskId) {
      setScheduledTasks(prev => {
        const updated = new Map(prev);
        updated.set(key, taskId);
        return updated;
      });
      
      console.log(`Created habit task: ${taskId}`);
    }
    
    return taskId;
  }, [scheduledTasks]);
  
  // Set up habit:schedule event listener
  useEvent('habit:schedule', handleHabitSchedule);
  
  // Handle habit completion (mark corresponding task as complete)
  const handleHabitComplete = useCallback((data: {
    habitId: string;
    date: string;
    value: boolean | number;
  }) => {
    const { habitId, date, value } = data;
    
    // Basic validation
    if (!habitId || !date) {
      console.error('Invalid habit completion data');
      return;
    }
    
    // Find and complete the corresponding task
    const tasksStr = localStorage.getItem('tasks');
    if (!tasksStr) return;
    
    try {
      const tasks: Task[] = JSON.parse(tasksStr);
      
      const matchingTask = tasks.find(task => {
        if (!task.relationships) return false;
        return task.relationships.habitId === habitId && 
               task.relationships.date === date.split('T')[0];
      });
      
      if (matchingTask && !matchingTask.completed) {
        console.log(`Completing task ${matchingTask.id} for habit ${habitId}`);
        taskOperations.completeTask(matchingTask.id, { value });
      }
    } catch (error) {
      console.error('Error processing habit completion:', error);
    }
  }, []);
  
  // Set up habit:complete event listener
  useEffect(() => {
    const unsubscribe = eventManager.on('habit:complete', handleHabitComplete);
    return unsubscribe;
  }, [handleHabitComplete]);
  
  // Check for pending habits and create tasks if needed
  const checkPendingHabits = useCallback(() => {
    console.log('Checking for pending habit tasks');
    
    // This is just a stub - the actual logic is in the useHabitTaskProcessor hook
    eventManager.emit('habits:check-pending', {});
  }, []);
  
  return {
    // Public API
    handleHabitSchedule,
    handleHabitComplete,
    checkPendingHabits,
    scheduledTasks
  };
};
