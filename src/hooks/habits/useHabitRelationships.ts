
import { useCallback } from 'react';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';

interface HabitRelationshipsReturn {
  getRelatedTasks: (habitId: string, date?: string) => Task[];
  getRelatedHabit: (taskId: string) => string | null;
}

/**
 * Hook to manage relationships between habits and tasks
 */
export const useHabitRelationships = (): HabitRelationshipsReturn => {
  /**
   * Get tasks related to a specific habit
   */
  const getRelatedTasks = useCallback((habitId: string, date?: string): Task[] => {
    if (!habitId) return [];
    
    // Use today's date if not specified
    const targetDate = date || new Date().toDateString();
    
    // Get all tasks
    const allTasks = taskStorage.loadTasks();
    
    // Filter tasks related to this habit on the specified date
    return allTasks.filter(task => 
      task.relationships?.habitId === habitId && 
      (!date || task.relationships?.date === targetDate)
    );
  }, []);
  
  /**
   * Get the habitId related to a specific task
   */
  const getRelatedHabit = useCallback((taskId: string): string | null => {
    if (!taskId) return null;
    
    // Get all tasks
    const allTasks = taskStorage.loadTasks();
    
    // Find the task
    const task = allTasks.find(t => t.id === taskId);
    
    // Return the habitId if found
    return task?.relationships?.habitId || null;
  }, []);
  
  return {
    getRelatedTasks,
    getRelatedHabit
  };
};
