
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';

/**
 * A unified hook that provides habit-related event functions
 */
export const useHabitEvents = () => {
  // Complete a habit
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true) => {
    // Update payload to match expected type
    eventManager.emit('habit:complete', {
      habitId,
      date,
      value
    });
  }, []);

  // Trigger habit tasks check
  const checkPendingHabits = useCallback(() => {
    eventManager.emit('habits:check-pending', {});
  }, []);

  // Schedule a habit task
  const scheduleHabitTask = useCallback((
    habitId: string,
    templateId: string,
    name: string,
    duration: number,
    date: string,
    metricType?: string
  ) => {
    eventManager.emit('habit:schedule', {
      habitId,
      templateId,
      name,
      duration,
      date,
      metricType
    });
  }, []);

  // Update a habit template
  const updateHabitTemplate = useCallback((templateData: any) => {
    eventManager.emit('habit:template-update', templateData);
  }, []);

  // Delete a habit template
  const deleteHabitTemplate = useCallback((templateId: string, isOriginatingAction: boolean = true) => {
    eventManager.emit('habit:template-delete', {
      templateId,
      isOriginatingAction
    });
  }, []);

  // Add a habit template
  const addHabitTemplate = useCallback((templateId: string) => {
    eventManager.emit('habit:template-add', {
      templateId
    });
  }, []);

  // Open journal for a habit - using type assertion for additional properties
  const openHabitJournal = useCallback((habitId: string, habitName: string, description?: string, templateId?: string) => {
    // Use type assertion to allow additional properties
    eventManager.emit('journal:open', {
      habitId,
      habitName,
      description,
      templateId
    } as any);
  }, []);

  return {
    completeHabit,
    checkPendingHabits,
    scheduleHabitTask,
    updateHabitTemplate,
    deleteHabitTemplate,
    addHabitTemplate,
    openHabitJournal
  };
};
