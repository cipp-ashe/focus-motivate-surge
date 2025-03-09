
import { useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { useTaskEvents } from '../useTaskEvents';

/**
 * Hook to check for missing habit tasks and verify against localStorage
 */
export const useHabitTaskChecker = (tasks: Task[]) => {
  const { forceTaskUpdate } = useTaskEvents();
  
  /**
   * Check for missing habit tasks and force update if needed
   */
  const checkForMissingHabitTasks = useCallback(() => {
    console.log("Manually checking for missing habit tasks");
    
    // Trigger a habit check
    eventBus.emit('habits:check-pending', {});
    
    // Verify against localStorage tasks
    setTimeout(() => {
      // Get all tasks from localStorage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      
      // Find habit tasks
      const habitTasks = storedTasks.filter((task: Task) => task.relationships?.habitId);
      
      if (habitTasks.length > 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage during check`);
        
        // Find tasks that exist in localStorage but not in memory
        const missingTasks = habitTasks.filter((storedTask: Task) => 
          !tasks.some(memTask => memTask.id === storedTask.id)
        );
        
        if (missingTasks.length > 0) {
          console.log(`Found ${missingTasks.length} tasks in localStorage that are missing from memory`);
          
          // Add each missing task to state via event bus
          missingTasks.forEach(task => {
            console.log(`Adding missing task to memory: ${task.name} (${task.id})`);
            eventBus.emit('task:create', task);
          });
          
          // Force a task update to ensure UI updates
          setTimeout(() => forceTaskUpdate(), 200);
        } else {
          console.log('All habit tasks from localStorage are already loaded in memory');
        }
      } else if (tasks.some(task => task.relationships?.habitId)) {
        // We have habit tasks in memory but none in localStorage - need to persist them
        console.log('Found habit tasks in memory but none in localStorage - persisting them');
        
        const habitTasksInMemory = tasks.filter(task => task.relationships?.habitId);
        
        // Update localStorage with memory tasks
        localStorage.setItem('taskList', JSON.stringify([...storedTasks, ...habitTasksInMemory]));
        
        console.log(`Persisted ${habitTasksInMemory.length} habit tasks to localStorage`);
      }
    }, 200);
  }, [tasks, forceTaskUpdate]);
  
  return {
    checkForMissingHabitTasks
  };
};
