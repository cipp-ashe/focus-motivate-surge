
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { Task } from '@/types/tasks';

/**
 * Hook to clean up habit tasks that are no longer needed
 */
export const useHabitTaskCleanup = () => {
  const cleanupOrphanedHabitTasks = useCallback((tasks: Task[], templates: any[]) => {
    // Find tasks that reference non-existent templates
    const templateIds = templates.map(t => t.templateId || t.id);
    const orphanedTasks = tasks.filter(task => {
      const templateId = task.relationships?.templateId;
      return templateId && !templateIds.includes(templateId);
    });

    console.log(`Found ${orphanedTasks.length} orphaned habit tasks`);
    
    // Could emit events to delete them or mark them
    return orphanedTasks;
  }, []);

  const removeHabitTasks = useCallback((templateId: string) => {
    console.log(`Removing habit tasks for template ${templateId}`);
    // This could emit an event to trigger cleanup
  }, []);

  // Add the missing deleteHabitTask method
  const deleteHabitTask = useCallback((taskId: string, reason?: string) => {
    console.log(`Deleting habit task ${taskId}`, reason ? `Reason: ${reason}` : '');
    eventManager.emit('task:delete', { taskId, reason });
  }, []);

  return {
    cleanupOrphanedHabitTasks,
    removeHabitTasks,
    deleteHabitTask
  };
};
