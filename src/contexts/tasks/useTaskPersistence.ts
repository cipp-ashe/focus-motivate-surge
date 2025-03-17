
import { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';

/**
 * Hook for persisting task state to storage
 * 
 * @param tasks Active tasks to persist
 * @param completedTasks Completed tasks to persist
 */
export const useTaskPersistence = (tasks: Task[] = [], completedTasks: Task[] = []) => {
  // Save tasks to storage whenever they change
  useEffect(() => {
    if (!tasks) return; // Guard against undefined tasks
    
    try {
      console.log(`TaskPersistence: Saving ${tasks.length} tasks to storage`);
      taskStorage.saveTasks(tasks);
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }, [tasks]);
  
  // Save completed tasks to storage whenever they change
  useEffect(() => {
    if (!completedTasks) return; // Guard against undefined completedTasks
    
    try {
      console.log(`TaskPersistence: Saving ${completedTasks.length} completed tasks to storage`);
      taskStorage.saveCompletedTasks(completedTasks);
    } catch (error) {
      console.error('Error saving completed tasks to storage:', error);
    }
  }, [completedTasks]);
};
