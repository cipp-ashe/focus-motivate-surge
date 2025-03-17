
import { useCallback, useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

/**
 * Hook to verify that all habit tasks are properly created and loaded
 */
export const useHabitTaskChecker = (tasks: Task[]) => {
  const lastCheckRef = useRef(Date.now());
  const checkingRef = useRef(false);

  // Checks for missing habit tasks that should exist based on localStorage
  const checkForMissingHabitTasks = useCallback(() => {
    // Prevent concurrent checks
    if (checkingRef.current) {
      console.log('HabitTaskChecker: Already checking for missing tasks, skipping');
      return;
    }
    
    // Prevent too frequent checks
    const now = Date.now();
    if (now - lastCheckRef.current < 500) {
      console.log('HabitTaskChecker: Check requested too soon, skipping');
      return;
    }
    
    lastCheckRef.current = now;
    checkingRef.current = true;
    
    console.log('HabitTaskChecker: Checking for missing habit tasks');
    
    try {
      // Load all tasks from storage
      const storedTasks = taskStorage.loadTasks();
      
      // Filter for habit tasks (have relationship.habitId)
      const habitTasks = storedTasks.filter((task: Task) => 
        task.relationships?.habitId && !task.completed
      );
      
      console.log(`HabitTaskChecker: Found ${habitTasks.length} habit tasks in storage`);
      
      if (habitTasks.length === 0) {
        // No habit tasks in storage, nothing to check
        console.log('HabitTaskChecker: No habit tasks in storage, nothing to check');
        checkingRef.current = false;
        return;
      }
      
      // Find tasks that are in storage but not in memory
      const memoryHabitTasks = tasks.filter(task => task.relationships?.habitId);
      console.log(`HabitTaskChecker: Found ${memoryHabitTasks.length} habit tasks in memory`);
      
      const missingTasks = habitTasks.filter((storageTask: Task) => 
        !tasks.some(memTask => 
          memTask.id === storageTask.id || 
          (memTask.relationships?.habitId === storageTask.relationships?.habitId && 
           memTask.relationships?.date === storageTask.relationships?.date)
        )
      );
      
      if (missingTasks.length > 0) {
        console.log(`HabitTaskChecker: Found ${missingTasks.length} missing tasks!`);
        
        // Add missing tasks to memory via task:create events
        missingTasks.forEach((task: Task) => {
          console.log(`HabitTaskChecker: Adding missing task to memory: ${task.name} (${task.id})`);
          eventManager.emit('task:create', task);
        });
        
        // Force UI update
        window.dispatchEvent(new Event('force-task-update'));
        
        // Show notification
        if (missingTasks.length > 0) {
          toast.info(`Loaded ${missingTasks.length} habit tasks`, {
            description: "Your scheduled habit tasks have been synchronized."
          });
        }
      } else {
        console.log('HabitTaskChecker: All habit tasks are properly loaded in memory');
      }
    } catch (error) {
      console.error('HabitTaskChecker: Error checking for missing tasks', error);
    } finally {
      checkingRef.current = false;
    }
  }, [tasks]);

  // Set up periodic verification
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only run checks if we have tasks in memory already (avoid unnecessary checks)
      if (tasks.length > 0) {
        checkForMissingHabitTasks();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [checkForMissingHabitTasks, tasks.length]);

  return { checkForMissingHabitTasks };
};
