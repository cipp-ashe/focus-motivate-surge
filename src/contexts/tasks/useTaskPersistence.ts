import { useEffect, useRef, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook for persisting task state to storage
 */
export const useTaskPersistence = (tasks: Task[] = [], completedTasks: Task[] = []) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const previousTasksRef = useRef<Task[]>([]);
  const previousCompletedTasksRef = useRef<Task[]>([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);

  // Better task comparison function that avoids unnecessary saves
  const haveTasksChanged = useCallback((oldTasks: Task[], newTasks: Task[]) => {
    // Quick length check
    if (oldTasks.length !== newTasks.length) return true;
    if (oldTasks.length === 0 && newTasks.length === 0) return false;
    
    // For small lists, do a proper comparison
    if (newTasks.length <= 5) {
      const oldJson = JSON.stringify(oldTasks);
      const newJson = JSON.stringify(newTasks);
      return oldJson !== newJson;
    }
    
    // For larger lists, check IDs and modification timestamps
    const oldTaskMap = new Map(oldTasks.map(task => [task.id, task]));
    
    for (const newTask of newTasks) {
      const oldTask = oldTaskMap.get(newTask.id);
      
      // If task is new or has different completion status, it has changed
      if (!oldTask || oldTask.completed !== newTask.completed) {
        return true;
      }
      
      // If task status has changed, it has changed
      if (oldTask.status !== newTask.status) {
        return true;
      }
    }
    
    return false;
  }, []);

  // Save tasks to storage only when they actually change
  useEffect(() => {
    if (!tasks) return; // Guard against undefined tasks
    
    // Skip saving if no actual change
    if (!haveTasksChanged(previousTasksRef.current, tasks)) {
      return;
    }
    
    // Update our reference copy
    previousTasksRef.current = [...tasks];
    
    // Debounce the save operation with a longer timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Save to local storage
        taskStorage.saveTasks(tasks);
        
        // Sync to Supabase only if authenticated and we have tasks to sync
        if (user && tasks.length > 0 && !syncInProgressRef.current) {
          syncInProgressRef.current = true;
          
          // We'll handle this asynchronously
          const syncToSupabase = async () => {
            try {
              for (const task of tasks) {
                // Format task for database
                const dbTask = {
                  id: task.id,
                  user_id: user.id,
                  name: task.name,
                  description: task.description || '',
                  task_type: task.taskType || 'regular',
                  completed: false,
                  status: task.status || 'pending',
                  estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null,
                  tags: task.tags || [],
                  metrics: task.metrics ? JSON.stringify(task.metrics) : null,
                  relationships: task.relationships ? JSON.stringify(task.relationships) : null
                };
                
                // Upsert to database
                const { error } = await supabase
                  .from('tasks')
                  .upsert(dbTask, { onConflict: 'id' });
                
                if (error) {
                  console.error('Error syncing task to Supabase:', error);
                }
              }
            } catch (error) {
              console.error('Error in Supabase sync:', error);
              toast.error("Error saving tasks", {
                description: "There was a problem saving your tasks to the cloud."
              });
            } finally {
              syncInProgressRef.current = false;
            }
          };
          
          syncToSupabase();
        }
      } catch (error) {
        console.error('Error saving tasks to storage:', error);
        toast.error("Error saving tasks", {
          description: "There was a problem saving your tasks."
        });
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 2000); // Longer debounce of 2 seconds
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [tasks, user, toast, haveTasksChanged]);
  
  // Save completed tasks to storage with similar optimizations
  useEffect(() => {
    if (!completedTasks) return; // Guard against undefined completedTasks
    
    // Skip saving if no actual change
    if (!haveTasksChanged(previousCompletedTasksRef.current, completedTasks)) {
      return;
    }
    
    // Update our reference copy
    previousCompletedTasksRef.current = [...completedTasks];
    
    // Debounce the save operation
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      try {
        taskStorage.saveCompletedTasks(completedTasks);
        
        // If user is authenticated, also save completed tasks to Supabase
        if (user && completedTasks.length > 0 && !syncInProgressRef.current) {
          // Set the sync flag to prevent multiple simultaneous syncs
          syncInProgressRef.current = true;

          // We'll do this asynchronously to avoid blocking the UI
          const syncCompletedToSupabase = async () => {
            try {
              for (const task of completedTasks) {
                // Format task for database
                const dbTask = {
                  id: task.id,
                  user_id: user.id,
                  name: task.name,
                  description: task.description || '',
                  task_type: task.taskType || 'regular',
                  completed: true,
                  completed_at: task.completedAt || new Date().toISOString(),
                  status: 'completed',
                  estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null,
                  tags: task.tags || [],
                  metrics: task.metrics ? JSON.stringify(task.metrics) : null,
                  relationships: task.relationships ? JSON.stringify(task.relationships) : null
                };

                // Upsert to database
                const { error } = await supabase
                  .from('tasks')
                  .upsert(dbTask, { onConflict: 'id' });

                if (error) {
                  console.error('Error syncing completed task to Supabase:', error);
                }
              }
            } catch (error) {
              console.error('Error in Supabase completed tasks sync:', error);
              toast.error("Error saving completed tasks", {
                description: "There was a problem saving your completed tasks to the cloud."
              });
            } finally {
              syncInProgressRef.current = false;
            }
          };

          syncCompletedToSupabase();
        }
      } catch (error) {
        console.error('Error saving completed tasks to storage:', error);
        toast.error("Error saving completed tasks", {
          description: "There was a problem saving your completed tasks."
        });
      } finally {
        saveTimeoutRef.current = null;
      }
    }, 1000); // Debounce for 1 second
  }, [completedTasks, user, toast, haveTasksChanged]);
};
