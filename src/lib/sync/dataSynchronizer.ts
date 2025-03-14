import { supabase } from '@/lib/supabase/client';
import { Task } from '@/types/tasks';
import { HabitDetail, ActiveTemplate } from '@/components/habits/types';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

/**
 * Synchronize local tasks to Supabase
 */
export const syncTasksToSupabase = async (userId: string): Promise<boolean> => {
  try {
    // Load tasks from localStorage
    const localTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    
    if (localTasks.length === 0) {
      console.log('No local tasks to sync');
      return true;
    }
    
    // Add user_id to each task
    const tasksWithUserId = localTasks.map((task: Task) => ({
      ...task,
      user_id: userId,
      // Convert camelCase to snake_case for database compatibility
      completed_at: task.completedAt,
      dismissed_at: task.dismissedAt,
      estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null,
      metrics: task.metrics ? JSON.stringify(task.metrics) : null,
      relationships: task.relationships ? JSON.stringify(task.relationships) : null
    }));
    
    // Insert tasks into Supabase
    const { error } = await supabase
      .from('tasks')
      .upsert(tasksWithUserId, { onConflict: 'id' });
      
    if (error) {
      console.error('Error syncing tasks to Supabase:', error);
      return false;
    }
    
    console.log(`Successfully synced ${tasksWithUserId.length} tasks to Supabase`);
    return true;
  } catch (error) {
    console.error('Error in syncTasksToSupabase:', error);
    return false;
  }
};

/**
 * Synchronize local habits to Supabase
 */
export const syncHabitsToSupabase = async (userId: string): Promise<boolean> => {
  try {
    // Load habit templates from localStorage
    const localTemplates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
    
    if (localTemplates.length === 0) {
      console.log('No local habit templates to sync');
      return true;
    }
    
    // Add user_id to each template and format for database
    const templatesWithUserId = localTemplates.map((template: ActiveTemplate) => ({
      id: template.templateId,
      user_id: userId,
      name: template.name || 'Unnamed Template',
      description: template.description || '',
      days: template.activeDays || [],
      habits: JSON.stringify(template.habits || []),
      is_active: true
    }));
    
    // Insert templates into Supabase
    const { error } = await supabase
      .from('habit_templates')
      .upsert(templatesWithUserId, { onConflict: 'id' });
      
    if (error) {
      console.error('Error syncing habit templates to Supabase:', error);
      return false;
    }
    
    console.log(`Successfully synced ${templatesWithUserId.length} habit templates to Supabase`);
    return true;
  } catch (error) {
    console.error('Error in syncHabitsToSupabase:', error);
    return false;
  }
};

/**
 * Synchronize local notes to Supabase
 */
export const syncNotesToSupabase = async (userId: string): Promise<boolean> => {
  try {
    // Load notes from localStorage
    const localNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    
    if (localNotes.length === 0) {
      console.log('No local notes to sync');
      return true;
    }
    
    // Add user_id to each note
    const notesWithUserId = localNotes.map((note: any) => ({
      ...note,
      user_id: userId
    }));
    
    // Insert notes into Supabase
    const { error } = await supabase
      .from('notes')
      .upsert(notesWithUserId, { onConflict: 'id' });
      
    if (error) {
      console.error('Error syncing notes to Supabase:', error);
      return false;
    }
    
    console.log(`Successfully synced ${notesWithUserId.length} notes to Supabase`);
    return true;
  } catch (error) {
    console.error('Error in syncNotesToSupabase:', error);
    return false;
  }
};

/**
 * Synchronize all local data to Supabase
 */
export const syncLocalDataToSupabase = async (userId: string): Promise<void> => {
  toast.info('Syncing your data to the cloud...', { id: 'sync-data' });
  
  // Sync all data types
  const tasksSuccess = await syncTasksToSupabase(userId);
  const habitsSuccess = await syncHabitsToSupabase(userId);
  const notesSuccess = await syncNotesToSupabase(userId);
  
  if (tasksSuccess && habitsSuccess && notesSuccess) {
    toast.success('All your data has been synced to the cloud!', { id: 'sync-data' });
  } else {
    toast.error('Some data could not be synced. Please try again later.', { id: 'sync-data' });
  }
};

/**
 * Get data from Supabase or localStorage based on auth status
 */
export const getTaskData = async (userId: string | null): Promise<Task[]> => {
  // If user is not authenticated, use localStorage
  if (!userId) {
    const localTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    return localTasks;
  }
  
  // Otherwise, fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false);
      
    if (error) {
      console.error('Error fetching tasks from Supabase:', error);
      return [];
    }
    
    // Convert snake_case to camelCase for frontend compatibility
    return data.map((task: any) => ({
      id: task.id,
      name: task.name,
      description: task.description,
      completed: task.completed,
      completedAt: task.completed_at,
      dismissedAt: task.dismissed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      taskType: task.task_type,
      duration: task.estimated_minutes ? task.estimated_minutes * 60 : undefined,
      status: task.status,
      tags: task.tags || [],
      metrics: task.metrics ? JSON.parse(task.metrics) : null,
      relationships: task.relationships ? JSON.parse(task.relationships) : null
    }));
  } catch (error) {
    console.error('Error in getTaskData:', error);
    return [];
  }
};

/**
 * Decide whether to use local or cloud storage based on auth status
 */
export const shouldUseLocalStorage = (user: User | null): boolean => {
  return !user;
};
