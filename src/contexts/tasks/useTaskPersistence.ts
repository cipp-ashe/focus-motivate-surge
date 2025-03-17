
import { useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook for persisting task state to storage
 * 
 * @param tasks Active tasks to persist
 * @param completedTasks Completed tasks to persist
 */
export const useTaskPersistence = (tasks: Task[] = [], completedTasks: Task[] = []) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const previousTasksLengthRef = useRef<number>(0);
  const previousCompletedTasksLengthRef = useRef<number>(0);

  // Save tasks to storage only when they actually change in a meaningful way
  useEffect(() => {
    if (!tasks) return; // Guard against undefined tasks
    
    // Skip saving if the array length hasn't changed and we've already saved before
    if (tasks.length === 0 && previousTasksLengthRef.current === 0) {
      return;
    }
    
    // Update our reference of the previous length
    previousTasksLengthRef.current = tasks.length;
    
    try {
      if (tasks.length > 0) {
        console.log(`TaskPersistence: Saving ${tasks.length} tasks to storage`);
      }
      
      // Always save to local storage for maximum reliability
      taskStorage.saveTasks(tasks);

      // If user is authenticated, also save to Supabase
      if (user && tasks.length > 0) {
        console.log(`TaskPersistence: User authenticated, syncing tasks to Supabase`);
        // We'll do this asynchronously to avoid blocking the UI
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
            // Use toast.error instead of calling toast directly
            toast.error("Error saving tasks", {
              description: "There was a problem saving your tasks to the cloud."
            });
          }
        };

        syncToSupabase();
      }
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
      // Use toast.error instead of calling toast directly
      toast.error("Error saving tasks", {
        description: "There was a problem saving your tasks."
      });
    }
  }, [tasks, user, toast]);
  
  // Save completed tasks to storage only when they actually change
  useEffect(() => {
    if (!completedTasks) return; // Guard against undefined completedTasks
    
    // Skip saving if the array length hasn't changed and we've already saved before
    if (completedTasks.length === 0 && previousCompletedTasksLengthRef.current === 0) {
      return;
    }
    
    // Update our reference of the previous length
    previousCompletedTasksLengthRef.current = completedTasks.length;
    
    try {
      if (completedTasks.length > 0) {
        console.log(`TaskPersistence: Saving ${completedTasks.length} completed tasks to storage`);
      }
      
      taskStorage.saveCompletedTasks(completedTasks);
      
      // If user is authenticated, also save completed tasks to Supabase
      if (user && completedTasks.length > 0) {
        console.log(`TaskPersistence: User authenticated, syncing completed tasks to Supabase`);
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
            // Use toast.error instead of calling toast directly
            toast.error("Error saving completed tasks", {
              description: "There was a problem saving your completed tasks to the cloud."
            });
          }
        };

        syncCompletedToSupabase();
      }
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
      // Use toast.error instead of calling toast directly
      toast.error("Error saving completed tasks", {
        description: "There was a problem saving your completed tasks."
      });
    }
  }, [completedTasks, user, toast]);
};
