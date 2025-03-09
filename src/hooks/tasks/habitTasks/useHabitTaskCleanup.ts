
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for cleaning up habit tasks with improved storage handling
 */
export const useHabitTaskCleanup = (tasks: Task[]) => {
  // Handle task deletion events
  const handleTaskDelete = useCallback((event: { taskId: string; reason?: string }) => {
    const { taskId, reason } = event;
    console.log(`Handling task delete: ${taskId}, reason: ${reason || 'not specified'}`);
    
    // Find the task in the current tasks array
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      console.log(`Task ${taskId} not found in memory, checking storage`);
      
      // Check if the task exists in localStorage using the storage service
      const storedTasks = taskStorage.loadTasks();
      const storedTask = storedTasks.find((t: Task) => t.id === taskId);
      
      if (!storedTask) {
        console.log(`Task ${taskId} not found in storage either, nothing to delete`);
        return;
      }
    }
    
    // If this was a habit task, update the tracking system
    if (task?.relationships?.habitId) {
      console.log(`Deleted task ${taskId} was a habit task, updating tracking`);
      
      // Emit an event to indicate this habit task is no longer active
      // This can be useful for habit progress tracking
      eventBus.emit('habit:task-deleted', {
        habitId: task.relationships.habitId,
        taskId: task.id,
        date: task.relationships.date
      });
    }
  }, [tasks]);
  
  // Set up daily cleanup of old habit tasks
  const setupDailyCleanup = useCallback(() => {
    console.log('Setting up daily cleanup for habit tasks');
    
    // Clean up old tasks once a day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 5, 0, 0); // 12:05 AM
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`Scheduling daily cleanup in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
    
    // Set timeout for daily cleanup
    const timeoutId = setTimeout(() => {
      performDailyCleanup();
      
      // Re-schedule for the next day
      setupDailyCleanup();
    }, timeUntilMidnight);
    
    return timeoutId;
  }, []);
  
  // Perform the actual cleanup of old habit tasks
  const performDailyCleanup = useCallback(() => {
    console.log('Performing daily cleanup of old habit tasks');
    
    try {
      // Get all tasks using the storage service
      const allTasks = taskStorage.loadTasks();
      
      // Get habit tasks
      const habitTasks = allTasks.filter((task: Task) => 
        task.relationships?.habitId && task.relationships?.date
      );
      
      if (habitTasks.length === 0) {
        console.log('No habit tasks to clean up');
        return;
      }
      
      // Find tasks older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldTasks = habitTasks.filter((task: Task) => {
        if (!task.relationships?.date) return false;
        
        const taskDate = new Date(task.relationships.date);
        return taskDate < thirtyDaysAgo;
      });
      
      if (oldTasks.length === 0) {
        console.log('No old habit tasks to clean up');
        return;
      }
      
      console.log(`Found ${oldTasks.length} old habit tasks to clean up`);
      
      // Delete old tasks
      oldTasks.forEach((task: Task) => {
        eventBus.emit('task:delete', { 
          taskId: task.id, 
          reason: 'automated-cleanup' 
        });
        console.log(`Cleaned up old habit task: ${task.id} from ${task.relationships?.date}`);
      });
      
    } catch (error) {
      console.error('Error performing daily cleanup:', error);
    }
  }, []);
  
  return {
    handleTaskDelete,
    setupDailyCleanup,
    performDailyCleanup
  };
};
