import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { ActiveTemplate } from '@/components/habits/types';

/**
 * Synchronize local tasks to Supabase
 */
export const syncTasksToSupabase = async (userId: string): Promise<boolean> => {
  // Check if we're in local-only mode
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  if (isLocalOnly) {
    console.log('Local-only mode active, skipping sync to Supabase');
    return true;
  }
  
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
  // Check if we're in local-only mode
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  if (isLocalOnly) {
    console.log('Local-only mode active, skipping sync to Supabase');
    return true;
  }
  
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
  // Check if we're in local-only mode
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  if (isLocalOnly) {
    console.log('Local-only mode active, skipping sync to Supabase');
    return true;
  }
  
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
 * Sync local data to Supabase after first login
 * @param userId The user's ID from Supabase Auth
 */
export const syncLocalDataToSupabase = async (userId: string) => {
  // Check if we're in local-only mode
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  if (isLocalOnly) {
    console.log('Local-only mode active, skipping sync to Supabase');
    return;
  }
  
  console.log(`Syncing local data to Supabase for user ${userId}`);
  
  try {
    const localTasks = taskStorage.loadTasks();
    
    if (localTasks.length === 0) {
      console.log('No local tasks to sync');
      return;
    }
    
    toast.info(`Syncing ${localTasks.length} tasks to your account...`);
    
    // First check if user already has tasks in Supabase
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (existingTasks && existingTasks.length > 0) {
      console.log('User already has tasks in Supabase, skipping sync');
      toast.info('Your account already has task data. Local tasks won\'t be synced to avoid duplicates.');
      return;
    }
    
    // Convert tasks to Supabase format
    const tasksToInsert = localTasks.map(task => ({
      id: task.id,
      user_id: userId,
      name: task.name,
      description: task.description || '',
      status: task.status || 'pending',
      task_type: task.taskType || 'regular',
      completed: !!task.completed,
      completed_at: task.completedAt || null,
      created_at: task.createdAt,
      estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null,
      parent_id: null, // task.parentId is not in the Task type
      tags: task.tags || [],
      metrics: task.metrics ? JSON.stringify(task.metrics) : null,
      relationships: task.relationships ? JSON.stringify(task.relationships) : null
    }));
    
    // Insert in batches to avoid request size limits
    const batchSize = 50;
    for (let i = 0; i < tasksToInsert.length; i += batchSize) {
      const batch = tasksToInsert.slice(i, i + batchSize);
      const { error } = await supabase.from('tasks').insert(batch);
      
      if (error) {
        console.error('Error syncing batch:', error);
        toast.error('Error syncing some tasks');
      }
    }
    
    toast.success('Tasks successfully synced to your account!');
    console.log('Local tasks synced to Supabase successfully');
    
  } catch (error) {
    console.error('Error syncing local data to Supabase:', error);
    toast.error('Error syncing tasks to your account');
  }
};

/**
 * Get data from Supabase or localStorage based on auth status
 */
export const getTaskData = async (userId: string | null): Promise<Task[]> => {
  // Check if we're in local-only mode
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  
  // If user is not authenticated or in local-only mode, use localStorage
  if (!userId || isLocalOnly) {
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
 * Decide whether to use local or cloud storage based on auth status and preference
 */
export const shouldUseLocalStorage = (user: User | null): boolean => {
  const isLocalOnly = localStorage.getItem('prefer-local-only') === 'true';
  return !user || isLocalOnly;
};
