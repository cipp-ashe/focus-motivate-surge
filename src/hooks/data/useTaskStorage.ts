
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const useTaskStorage = () => {
  const [items, setItems] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [cleared, setCleared] = useState<Task[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load tasks when the user changes
  useEffect(() => {
    if (!user) {
      setItems([]);
      setCompleted([]);
      setIsLoading(false);
      return;
    }

    async function loadTasks() {
      try {
        setIsLoading(true);
        
        // Load active tasks
        const { data: activeTasks, error: activeError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('created_at', { ascending: false });
        
        if (activeError) throw activeError;
        
        // Load completed tasks
        const { data: completedTasks, error: completedError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false });
        
        if (completedError) throw completedError;
        
        setItems(activeTasks || []);
        setCompleted(completedTasks || []);
        
        console.log("Loaded tasks:", activeTasks?.length, "completed:", completedTasks?.length);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTasks();
  }, [user]);

  // Add a task
  const addTask = useCallback(async (task: Omit<Task, 'id' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to add tasks');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      window.dispatchEvent(new Event('tasksUpdated'));
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return false;
    }
  }, [user]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setItems(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
      
      // If completed status changed, move to appropriate list
      if (updates.completed !== undefined) {
        if (updates.completed) {
          const taskToMove = items.find(t => t.id === taskId);
          if (taskToMove) {
            const completedTask = { 
              ...taskToMove, 
              ...updates, 
              completed_at: updates.completed_at || new Date().toISOString() 
            };
            
            setItems(prev => prev.filter(t => t.id !== taskId));
            setCompleted(prev => [completedTask, ...prev]);
          }
        } else {
          const taskToMove = completed.find(t => t.id === taskId);
          if (taskToMove) {
            const activeTask = { 
              ...taskToMove, 
              ...updates, 
              completed_at: null 
            };
            
            setCompleted(prev => prev.filter(t => t.id !== taskId));
            setItems(prev => [activeTask, ...prev]);
          }
        }
      }
      
      window.dispatchEvent(new Event('tasksUpdated'));
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  }, [user, items, completed]);

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setItems(prev => prev.filter(task => task.id !== taskId));
      setCompleted(prev => prev.filter(task => task.id !== taskId));
      setSelected(prev => prev === taskId ? null : prev);
      
      window.dispatchEvent(new Event('tasksUpdated'));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  }, [user]);

  // Complete a task
  const completeTask = useCallback(async (taskId: string, metrics?: any) => {
    if (!user) return false;
    
    try {
      const task = items.find(t => t.id === taskId);
      if (!task) return false;
      
      const updates = {
        completed: true,
        completed_at: new Date().toISOString(),
        status: 'completed',
        metrics: metrics ? JSON.stringify(metrics) : null
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const completedTask = { ...task, ...updates };
      
      setItems(prev => prev.filter(t => t.id !== taskId));
      setCompleted(prev => [completedTask, ...prev]);
      setSelected(prev => prev === taskId ? null : prev);
      
      window.dispatchEvent(new Event('tasksUpdated'));
      return true;
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
      return false;
    }
  }, [user, items]);

  // Select a task
  const selectTask = useCallback((taskId: string | null) => {
    setSelected(taskId);
  }, []);

  // Migrate localStorage tasks to Supabase
  const migrateLocalTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      const localTasksJson = localStorage.getItem('taskList');
      const localCompletedTasksJson = localStorage.getItem('completedTasks');
      
      if (!localTasksJson && !localCompletedTasksJson) return;
      
      let localTasks: Task[] = [];
      let localCompletedTasks: Task[] = [];
      
      if (localTasksJson) {
        localTasks = JSON.parse(localTasksJson);
      }
      
      if (localCompletedTasksJson) {
        localCompletedTasks = JSON.parse(localCompletedTasksJson);
      }
      
      if (localTasks.length === 0 && localCompletedTasks.length === 0) return;
      
      toast.info('Migrating your tasks to your account...', { duration: 5000 });
      
      // Format tasks for database
      const tasksToInsert = localTasks.map(task => ({
        ...task,
        user_id: user.id,
        completed: false,
        estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null
      }));
      
      const completedTasksToInsert = localCompletedTasks.map(task => ({
        ...task,
        user_id: user.id,
        completed: true,
        completed_at: task.completedAt || new Date().toISOString(),
        estimated_minutes: task.duration ? Math.floor(task.duration / 60) : null
      }));
      
      // Insert in batches to avoid request size limits
      const insertBatch = async (tasks: any[]) => {
        if (tasks.length === 0) return;
        
        for (let i = 0; i < tasks.length; i += 50) {
          const batch = tasks.slice(i, i + 50);
          const { error } = await supabase.from('tasks').insert(batch);
          if (error) console.error('Error migrating batch:', error);
        }
      };
      
      await insertBatch(tasksToInsert);
      await insertBatch(completedTasksToInsert);
      
      // Clear localStorage after migration
      localStorage.removeItem('taskList');
      localStorage.removeItem('completedTasks');
      
      // Reload tasks
      const { data: activeTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false });
      
      const { data: completedTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false });
      
      setItems(activeTasks || []);
      setCompleted(completedTasks || []);
      
      toast.success('Tasks migrated successfully!');
    } catch (error) {
      console.error('Error migrating tasks:', error);
      toast.error('Failed to migrate tasks');
    }
  }, [user]);

  // Try to migrate local tasks when user logs in
  useEffect(() => {
    if (user && !isLoading) {
      migrateLocalTasks();
    }
  }, [user, isLoading, migrateLocalTasks]);

  return { 
    items, 
    completed,
    cleared,
    selected,
    isLoading,
    
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    selectTask,
  };
};
