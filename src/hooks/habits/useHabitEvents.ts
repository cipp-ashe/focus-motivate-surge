
/**
 * Simplified Habit Events Hook
 * 
 * This hook provides a clean interface for emitting habit-related events
 * by leveraging the consolidated types and event system.
 */

import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { MetricType, HabitDetail, DayOfWeek, ActiveTemplate } from '@/types/habits';

/**
 * A unified hook that provides habit-related event functions
 */
export const useHabitEvents = () => {
  // Complete a habit
  const completeHabit = useCallback((habitId: string, date: string, value: boolean | number = true, metricType?: MetricType, habitName?: string, templateId?: string) => {
    eventManager.emit('habit:complete', {
      habitId,
      date,
      value,
      metricType,
      habitName,
      templateId
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
    metricType?: MetricType
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

  // Template management events
  const updateHabitTemplate = useCallback((templateData: Partial<ActiveTemplate> & { templateId: string }) => {
    eventManager.emit('habit:template-update', templateData);
  }, []);

  const deleteHabitTemplate = useCallback((templateId: string, isOriginatingAction: boolean = true) => {
    eventManager.emit('habit:template-delete', {
      templateId,
      isOriginatingAction
    });
  }, []);

  const addHabitTemplate = useCallback((template: Partial<ActiveTemplate> & { templateId: string }) => {
    eventManager.emit('habit:template-add', template);
  }, []);
  
  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    eventManager.emit('habit:template-days-update', {
      templateId,
      activeDays: days
    });
  }, []);
  
  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    eventManager.emit('habit:template-order-update', templates);
  }, []);

  // Journal integration
  const openHabitJournal = useCallback((habitId: string, habitName: string, description?: string, templateId?: string, date?: string) => {
    eventManager.emit('journal:open', {
      habitId,
      habitName,
      description,
      templateId,
      date: date || new Date().toISOString()
    });
  }, []);

  // Dismiss habits
  const dismissHabit = useCallback((habitId: string, date: string) => {
    eventManager.emit('habit:dismiss', {
      habitId,
      date
    });
  }, []);

  return {
    completeHabit,
    checkPendingHabits,
    scheduleHabitTask,
    updateHabitTemplate,
    deleteHabitTemplate,
    addHabitTemplate,
    updateTemplateDays,
    updateTemplateOrder,
    openHabitJournal,
    dismissHabit
  };
};
