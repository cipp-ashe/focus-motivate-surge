
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to handle habit-task synchronization
 */
export const useSyncHandler = () => {
  // Sync habits with tasks
  const syncHabitsWithTasks = useCallback(() => {
    console.log('Syncing habits with tasks');
    eventManager.emit('habits:check-pending', {});
  }, []);

  // Handle habit completion
  const handleHabitComplete = useCallback((habitId: string, templateId: string, value: boolean | number) => {
    console.log('Handling habit completion', { habitId, templateId, value });
    eventManager.emit('habit:complete', {
      habitId,
      date: new Date().toISOString(),
      completed: !!value,
      value
    });
  }, []);

  // Update habit tasks when template changes
  const handleTemplateUpdate = useCallback((template: any) => {
    console.log('Handling template update for task sync', template);
    eventManager.emit('habit:tasks-sync', {
      templateId: template.templateId || template.id,
      habits: template.habits || []
    });
  }, []);

  return {
    syncHabitsWithTasks,
    handleHabitComplete,
    handleTemplateUpdate
  };
};
