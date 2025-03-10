
import { useCallback } from 'react';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';

// This is a hook that subscribes to task-related events
export const useTaskEvents = () => {
  // Handle task deletion logic with toast notification
  const deleteTask = useCallback((taskId: string, reason: string = 'user-action', suppressToast?: boolean) => {
    console.log(`TaskEvents: Deleting task ${taskId} (reason: ${reason})`, {suppressToast});
    
    try {
      // Get task before we delete it
      const task = taskStorage.getTaskById(taskId);
      
      if (!task) {
        console.warn(`Task not found for deletion: ${taskId}`);
        return;
      }
      
      // Remove from storage first to ensure persistence
      taskStorage.removeTask(taskId);
      
      // Then emit delete event
      eventBus.emit('task:delete', { taskId, reason });
      
      // Show success toast (only if not suppressed)
      if (!suppressToast) {
        toast.success(`Deleted task: ${task.name}`);
      }
      
      // Force state update
      forceTaskUpdate();
      
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  }, []);
  
  // Function to toggle completion status
  const toggleTaskCompletion = useCallback((taskId: string) => {
    console.log(`TaskEvents: Toggling completion for task ${taskId}`);
    
    try {
      const task = taskStorage.getTaskById(taskId);
      
      if (!task) {
        console.warn(`Task not found for toggling: ${taskId}`);
        return;
      }
      
      // Toggle completed status
      const updatedTask = {
        ...task,
        completed: !task.completed,
      };
      
      // Update in storage
      taskStorage.updateTask(updatedTask.id, updatedTask);
      
      // Emit task update event
      eventBus.emit('task:update', { taskId, updates: updatedTask });
      
      // Show toast based on completion state
      if (updatedTask.completed) {
        toast.success(`Completed: ${task.name}`);
      }
      
      // Force state update
      forceTaskUpdate();
      
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      toast.error('Failed to update task');
    }
  }, []);
  
  // Function to force an update of all tasks
  const forceTaskUpdate = useCallback(() => {
    console.log('TaskEvents: Force updating task list (debounced)');
    
    // Dispatch custom event to signal task list update
    const event = new CustomEvent('force-task-update');
    window.dispatchEvent(event);
    
    // Also emit event via event bus
    eventBus.emit('tasks:force-update', {
      timestamp: new Date().toISOString()
    });
  }, []);
  
  // Function to update tags 
  const forceTagsUpdate = useCallback(() => {
    console.log('TaskEvents: Force updating tags list');
    
    // Dispatch custom event to signal tags update
    const event = new CustomEvent('force-tags-update');
    window.dispatchEvent(event);
    
    // Also emit event via event bus
    eventBus.emit('tags:force-update', {
      timestamp: new Date().toISOString()
    });
  }, []);
  
  // Function to check pending habits
  const checkPendingHabits = useCallback(() => {
    console.log('TaskEvents: Checking for pending habits');
    
    // Emit event to check pending habits
    eventBus.emit('habits:check-pending', {});
  }, []);
  
  return {
    deleteTask,
    toggleTaskCompletion,
    forceTaskUpdate,
    forceTagsUpdate,
    checkPendingHabits
  };
};
